// Fetches 2026 projected stats from rotochamp.com for all 226 eligible players.
// Uses Baseball Savant CSV to resolve mlbamid for each player.
// Reads/updates scripts/player-analysis-2026.json in place.
// Run: node scripts/getRotochampProjections.js

const { load } = require('cheerio')
const { readFileSync, writeFileSync } = require('fs')

const PLAYERS = Object.keys(JSON.parse(readFileSync('scripts/player-analysis-2026.json', 'utf8')))

// ─── Name normalization (same as getPlayerAnalysis.js) ────────────────────────

function normalize(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+(Jr\.|Sr\.|II|III)$/i, '')
    .toLowerCase()
    .trim()
}

function parseCSVLine(line) {
  const result = []
  let current = '', inQuotes = false
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes }
    else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = '' }
    else { current += ch }
  }
  result.push(current.trim())
  return result
}

// ─── Step 1: Get mlbamid → name map from Baseball Savant ─────────────────────

async function fetchMlbamIds() {
  console.log('Fetching player IDs from Baseball Savant...')
  const url = 'https://baseballsavant.mlb.com/leaderboard/statcast?type=batter&year=2025&position=&team=&min=1&csv=true'
  const csv = await fetch(url).then(r => r.text())
  const lines = csv.trim().split('\n')
  const headers = parseCSVLine(lines[0])

  const combinedNameIdx = headers.indexOf('last_name, first_name')
  const lastIdx = headers.indexOf('last_name')
  const firstIdx = headers.indexOf('first_name')
  const idIdx = headers.indexOf('player_id')

  if (idIdx === -1) throw new Error('Could not find player_id column')

  const map = {} // normalizedName → { mlbamid, fullName }
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const cols = parseCSVLine(lines[i])
    const id = cols[idIdx]
    let fullName
    if (combinedNameIdx !== -1) {
      const combined = cols[combinedNameIdx] || ''
      const commaPos = combined.indexOf(',')
      if (commaPos !== -1) {
        const last = combined.slice(0, commaPos).trim()
        const first = combined.slice(commaPos + 1).trim()
        fullName = `${first} ${last}`.trim()
      } else {
        fullName = combined.trim()
      }
    } else {
      fullName = `${cols[firstIdx] || ''} ${cols[lastIdx] || ''}`.trim()
    }
    if (fullName && id) {
      map[normalize(fullName)] = { mlbamid: id, fullName }
    }
  }
  console.log(`  Found ${Object.keys(map).length} players in Savant`)
  return map
}

// ─── Step 2: Fetch rotochamp page and parse Composite row ─────────────────────

async function fetchProjection(name, mlbamid) {
  const url = `https://www.rotochamp.com/baseball/Player.aspx?mlbamid=${mlbamid}`
  let html
  try {
    html = await fetch(url).then(r => r.text())
  } catch (e) {
    return { error: `fetch failed: ${e.message}` }
  }

  const $ = load(html)
  const table = $('#MainContent_gridHitterProjections')
  if (!table.length) {
    return { error: 'no hitter table found' }
  }

  // Parse headers
  const headers = []
  table.find('tr').first().find('th, td').each((_, el) => {
    headers.push($(el).text().trim())
  })

  // Find Composite row
  let compositeValues = null
  table.find('tr').each((_, row) => {
    const cells = $(row).find('td')
    if (cells.first().text().trim().includes('Composite')) {
      compositeValues = []
      cells.each((_, td) => compositeValues.push($(td).text().trim()))
    }
  })

  if (!compositeValues) {
    return { error: 'no Composite row found' }
  }

  // Map headers to values (first column is the system name, skip it)
  const result = {}
  headers.forEach((h, i) => {
    if (h && h !== '' && compositeValues[i] !== undefined) {
      result[h] = compositeValues[i]
    }
  })

  return result
}

// ─── Step 3: Batch fetch with rate limiting ───────────────────────────────────

async function batchFetch(tasks, batchSize = 8, delayMs = 1000) {
  const results = {}
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize)
    const settled = await Promise.allSettled(
      batch.map(({ name, mlbamid }) =>
        fetchProjection(name, mlbamid).then(data => ({ name, data }))
      )
    )
    for (const s of settled) {
      if (s.status === 'fulfilled') {
        results[s.value.name] = s.value.data
      }
    }
    const done = Math.min(i + batchSize, tasks.length)
    process.stdout.write(`\r  ${done}/${tasks.length} fetched...`)
    if (done < tasks.length) await new Promise(r => setTimeout(r, delayMs))
  }
  console.log()
  return results
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const savantMap = await fetchMlbamIds()

  // Match each player to their mlbamid
  const tasks = []
  const unmatched = []
  for (const name of PLAYERS) {
    const entry = savantMap[normalize(name)]
    if (entry) {
      tasks.push({ name, mlbamid: entry.mlbamid })
    } else {
      unmatched.push(name)
    }
  }

  console.log(`Matched ${tasks.length}/${PLAYERS.length} players to mlbamid`)
  if (unmatched.length) {
    console.log(`Unmatched: ${unmatched.join(', ')}`)
  }

  console.log(`\nFetching rotochamp projections...`)
  const projections = await batchFetch(tasks)

  // Merge into existing analysis JSON
  const analysis = JSON.parse(readFileSync('scripts/player-analysis-2026.json', 'utf8'))
  let successCount = 0, errorCount = 0
  for (const [name, proj] of Object.entries(projections)) {
    if (analysis[name]) {
      if (proj.error) {
        analysis[name].projection2026 = null
        errorCount++
      } else {
        analysis[name].projection2026 = proj
        successCount++
      }
    }
  }
  // Players with no mlbamid match
  for (const name of unmatched) {
    if (analysis[name]) analysis[name].projection2026 = null
  }

  writeFileSync('scripts/player-analysis-2026.json', JSON.stringify(analysis, null, 2))
  console.log(`\nDone: ${successCount} projections saved, ${errorCount} errors`)
  console.log('Wrote scripts/player-analysis-2026.json')

  // Quick preview
  console.log('\nSample projections:')
  const samples = ['Aaron Judge', 'Cal Raleigh', 'Ketel Marte', 'Nick Kurtz']
  samples.forEach(name => {
    const p = analysis[name]?.projection2026
    console.log(`  ${name}: HR=${p?.HR ?? 'N/A'} AB=${p?.AB ?? 'N/A'} AVG=${p?.AVG ?? 'N/A'}`)
  })
}

main().catch(console.error)
