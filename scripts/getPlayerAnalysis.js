// Fetches 2024 and 2025 stats for all 226 players on the 2026 eligible list.
// Stats from FanGraphs: G, PA, HR, AVG, OBP, SLG, wOBA, xwOBA, wRC+, WAR
// Stats from Baseball Savant: avgEV (average exit velocity)
// Run: node scripts/getPlayerAnalysis.js

const { load } = require('cheerio')
const { writeFileSync } = require('fs')

// ─── 2026 eligible players ────────────────────────────────────────────────────

const PLAYERS = [
  { Name: "Cal Raleigh", cost: 60 },
  { Name: "Kyle Schwarber", cost: 56 },
  { Name: "Shohei Ohtani", cost: 55 },
  { Name: "Aaron Judge", cost: 53 },
  { Name: "Eugenio Suarez", cost: 49 },
  { Name: "Junior Caminero", cost: 45 },
  { Name: "Juan Soto", cost: 43 },
  { Name: "Pete Alonso", cost: 38 },
  { Name: "Jo Adell", cost: 37 },
  { Name: "Nick Kurtz", cost: 36 },
  { Name: "Taylor Ward", cost: 36 },
  { Name: "Riley Greene", cost: 36 },
  { Name: "Byron Buxton", cost: 35 },
  { Name: "Rafael Devers", cost: 35 },
  { Name: "Michael Busch", cost: 34 },
  { Name: "Trent Grisham", cost: 34 },
  { Name: "George Springer", cost: 32 },
  { Name: "Seiya Suzuki", cost: 32 },
  { Name: "Julio Rodriguez", cost: 32 },
  { Name: "Vinnie Pasquantino", cost: 32 },
  { Name: "Jazz Chisholm Jr.", cost: 31 },
  { Name: "Pete Crow-Armstrong", cost: 31 },
  { Name: "Shea Langeliers", cost: 31 },
  { Name: "Brandon Lowe", cost: 31 },
  { Name: "Francisco Lindor", cost: 31 },
  { Name: "Corbin Carroll", cost: 31 },
  { Name: "Spencer Torkelson", cost: 31 },
  { Name: "James Wood", cost: 31 },
  { Name: "Hunter Goodman", cost: 31 },
  { Name: "Willy Adames", cost: 30 },
  { Name: "Salvador Perez", cost: 30 },
  { Name: "Brent Rooker", cost: 30 },
  { Name: "Jose Ramirez", cost: 30 },
  { Name: "Cody Bellinger", cost: 29 },
  { Name: "Matt Olson", cost: 29 },
  { Name: "Christian Yelich", cost: 29 },
  { Name: "Ketel Marte", cost: 28 },
  { Name: "Manny Machado", cost: 27 },
  { Name: "Randy Arozarena", cost: 27 },
  { Name: "Andy Pages", cost: 27 },
  { Name: "Bryce Harper", cost: 27 },
  { Name: "Christian Walker", cost: 27 },
  { Name: "Kyle Manzardo", cost: 27 },
  { Name: "Zach Neto", cost: 26 },
  { Name: "Jose Altuve", cost: 26 },
  { Name: "Ben Rice", cost: 26 },
  { Name: "Jorge Polanco", cost: 26 },
  { Name: "Kerry Carpenter", cost: 26 },
  { Name: "Mike Trout", cost: 26 },
  { Name: "Tyler Soderstrom", cost: 25 },
  { Name: "Teoscar Hernandez", cost: 25 },
  { Name: "Brandon Nimmo", cost: 25 },
  { Name: "Kyle Stowers", cost: 25 },
  { Name: "Yandy Diaz", cost: 25 },
  { Name: "Trevor Story", cost: 25 },
  { Name: "Fernando Tatis Jr.", cost: 25 },
  { Name: "Giancarlo Stanton", cost: 24 },
  { Name: "Dansby Swanson", cost: 24 },
  { Name: "Freddie Freeman", cost: 24 },
  { Name: "Mickey Moniak", cost: 24 },
  { Name: "Ramon Laureano", cost: 24 },
  { Name: "Bobby Witt Jr.", cost: 23 },
  { Name: "Ian Happ", cost: 23 },
  { Name: "Vladimir Guerrero Jr.", cost: 23 },
  { Name: "Josh Bell", cost: 22 },
  { Name: "Elly De La Cruz", cost: 22 },
  { Name: "Matt Wallner", cost: 22 },
  { Name: "Lenyn Sosa", cost: 22 },
  { Name: "Wyatt Langford", cost: 22 },
  { Name: "Wilyer Abreu", cost: 22 },
  { Name: "Kyle Tucker", cost: 22 },
  { Name: "Spencer Steer", cost: 21 },
  { Name: "Corey Seager", cost: 21 },
  { Name: "Lawrence Butler", cost: 21 },
  { Name: "Jackson Chourio", cost: 21 },
  { Name: "Matt Chapman", cost: 21 },
  { Name: "Austin Wells", cost: 21 },
  { Name: "Agustin Ramirez", cost: 21 },
  { Name: "Marcell Ozuna", cost: 21 },
  { Name: "Colson Montgomery", cost: 21 },
  { Name: "Heliot Ramos", cost: 21 },
  { Name: "Addison Barger", cost: 21 },
  { Name: "Ronald Acuna Jr.", cost: 21 },
  { Name: "Oneil Cruz", cost: 20 },
  { Name: "Daulton Varsho", cost: 20 },
  { Name: "Josh Naylor", cost: 20 },
  { Name: "Mookie Betts", cost: 20 },
  { Name: "Willson Contreras", cost: 20 },
  { Name: "Andrew Benintendi", cost: 20 },
  { Name: "Yainer Diaz", cost: 20 },
  { Name: "Ryan McMahon", cost: 20 },
  { Name: "Isaac Paredes", cost: 20 },
  { Name: "Geraldo Perdomo", cost: 20 },
  { Name: "Michael Harris II", cost: 20 },
  { Name: "Ivan Herrera", cost: 19 },
  { Name: "Kody Clemens", cost: 19 },
  { Name: "Adolis Garcia", cost: 19 },
  { Name: "Drake Baldwin", cost: 19 },
  { Name: "Lourdes Gurriel Jr.", cost: 19 },
  { Name: "Logan O'Hoppe", cost: 19 },
  { Name: "Gavin Sheets", cost: 19 },
  { Name: "CJ Abrams", cost: 19 },
  { Name: "Anthony Volpe", cost: 19 },
  { Name: "Max Muncy", cost: 19 },
  { Name: "Alec Burleson", cost: 18 },
  { Name: "Brice Turang", cost: 18 },
  { Name: "Brett Baty", cost: 18 },
  { Name: "Bo Bichette", cost: 18 },
  { Name: "Alex Bregman", cost: 18 },
  { Name: "Nathaniel Lowe", cost: 18 },
  { Name: "Max Kepler", cost: 18 },
  { Name: "Jordan Westburg", cost: 17 },
  { Name: "Ryan O'Hearn", cost: 17 },
  { Name: "Rowdy Tellez", cost: 17 },
  { Name: "Mike Yastrzemski", cost: 17 },
  { Name: "Gunnar Henderson", cost: 17 },
  { Name: "Jeremy Pena", cost: 17 },
  { Name: "Nick Castellanos", cost: 17 },
  { Name: "Will Smith", cost: 17 },
  { Name: "Jackson Holliday", cost: 17 },
  { Name: "William Contreras", cost: 17 },
  { Name: "Mark Vientos", cost: 17 },
  { Name: "Carson Kelly", cost: 17 },
  { Name: "Trevor Larnach", cost: 17 },
  { Name: "Harrison Bader", cost: 17 },
  { Name: "Cedric Mullins II", cost: 17 },
  { Name: "Ceddanne Rafaela", cost: 16 },
  { Name: "Gleyber Torres", cost: 16 },
  { Name: "Maikel Garcia", cost: 16 },
  { Name: "Ozzie Albies", cost: 16 },
  { Name: "Sean Murphy", cost: 16 },
  { Name: "Jackson Merrill", cost: 16 },
  { Name: "Jarren Duran", cost: 16 },
  { Name: "Brooks Lee", cost: 16 },
  { Name: "Austin Riley", cost: 16 },
  { Name: "Jake Burger", cost: 16 },
  { Name: "Colton Cowser", cost: 16 },
  { Name: "Miguel Vargas", cost: 16 },
  { Name: "Luis Garcia Jr.", cost: 16 },
  { Name: "Bryan Reynolds", cost: 16 },
  { Name: "Wilmer Flores", cost: 16 },
  { Name: "Jordan Beck", cost: 16 },
  { Name: "Otto Lopez", cost: 15 },
  { Name: "Brenton Doyle", cost: 15 },
  { Name: "Trea Turner", cost: 15 },
  { Name: "Carlos Narvaez", cost: 15 },
  { Name: "Alejandro Kirk", cost: 15 },
  { Name: "Marcus Semien", cost: 15 },
  { Name: "Matt McLain", cost: 15 },
  { Name: "Austin Hays", cost: 15 },
  { Name: "Nolan Gorman", cost: 14 },
  { Name: "Jesus Sanchez", cost: 14 },
  { Name: "Andrew Vaughn", cost: 14 },
  { Name: "Danny Jansen", cost: 14 },
  { Name: "Noelvi Marte", cost: 14 },
  { Name: "Jonathan Aranda", cost: 14 },
  { Name: "JJ Bleday", cost: 14 },
  { Name: "Josh Jung", cost: 14 },
  { Name: "TJ Friedl", cost: 14 },
  { Name: "Jurickson Profar", cost: 14 },
  { Name: "Bo Naylor", cost: 14 },
  { Name: "Luis Robert Jr.", cost: 14 },
  { Name: "Tommy Edman", cost: 13 },
  { Name: "Jacob Wilson", cost: 13 },
  { Name: "Matt Shaw", cost: 13 },
  { Name: "Lars Nootbaar", cost: 13 },
  { Name: "Royce Lewis", cost: 13 },
  { Name: "Tyler Stephenson", cost: 13 },
  { Name: "Dillon Dingler", cost: 13 },
  { Name: "Bryson Stott", cost: 13 },
  { Name: "Colt Keith", cost: 13 },
  { Name: "Andrew McCutchen", cost: 13 },
  { Name: "Carlos Correa", cost: 13 },
  { Name: "Wenceel Perez", cost: 13 },
  { Name: "Will Benson", cost: 12 },
  { Name: "Nolan Schanuel", cost: 12 },
  { Name: "Yoan Moncada", cost: 12 },
  { Name: "Sal Frelick", cost: 12 },
  { Name: "Jorge Soler", cost: 12 },
  { Name: "J.P. Crawford", cost: 12 },
  { Name: "Victor Caratini", cost: 12 },
  { Name: "Zach McKinstry", cost: 12 },
  { Name: "Rhys Hoskins", cost: 12 },
  { Name: "Nathan Lukes", cost: 12 },
  { Name: "Javier Baez", cost: 12 },
  { Name: "Casey Schmitt", cost: 12 },
  { Name: "Nolan Arenado", cost: 12 },
  { Name: "J.T. Realmuto", cost: 12 },
  { Name: "Michael Conforto", cost: 12 },
  { Name: "Daniel Schneemann", cost: 12 },
  { Name: "Jeff McNeil", cost: 12 },
  { Name: "Dylan Moore", cost: 11 },
  { Name: "Alec Bohm", cost: 11 },
  { Name: "Ramon Urias", cost: 11 },
  { Name: "Gabriel Arias", cost: 11 },
  { Name: "Angel Martinez", cost: 11 },
  { Name: "Michael Toglia", cost: 11 },
  { Name: "Jonah Heim", cost: 11 },
  { Name: "Willi Castro", cost: 11 },
  { Name: "Coby Mayo", cost: 11 },
  { Name: "Josh Lowe", cost: 11 },
  { Name: "Kyle Higashioka", cost: 11 },
  { Name: "Francisco Alvarez", cost: 11 },
  { Name: "Edmundo Sosa", cost: 11 },
  { Name: "Spencer Horwitz", cost: 11 },
  { Name: "Christopher Morel", cost: 11 },
  { Name: "Dominic Canzone", cost: 11 },
  { Name: "Carlos Santana", cost: 11 },
  { Name: "Steven Kwan", cost: 11 },
  { Name: "Xander Bogaerts", cost: 11 },
  { Name: "Pedro Pages", cost: 11 },
  { Name: "Brooks Baldwin", cost: 11 },
  { Name: "Jake Cronenworth", cost: 11 },
  { Name: "Brandon Marsh", cost: 11 },
  { Name: "Davis Schneider", cost: 11 },
  { Name: "Caleb Durbin", cost: 11 },
  { Name: "Miguel Andujar", cost: 10 },
  { Name: "Tommy Pham", cost: 10 },
  { Name: "Josh Smith", cost: 10 },
  { Name: "Enrique Hernandez", cost: 10 },
  { Name: "Brendan Donovan", cost: 10 },
  { Name: "Heriberto Hernandez", cost: 10 },
  { Name: "Jasson Dominguez", cost: 10 },
  { Name: "Dylan Crews", cost: 10 },
  { Name: "Eli White", cost: 10 },
  { Name: "Paul Goldschmidt", cost: 10 },
]

// ─── Seasons ──────────────────────────────────────────────────────────────────

const SEASONS = [
  { year: 2024, startDate: '2024-03-28', endDate: '2024-09-29' },
  { year: 2025, startDate: '2025-03-27', endDate: '2025-09-30' },
]

// ─── FanGraphs ────────────────────────────────────────────────────────────────

// Returns { [playerName]: { G, PA, HR, AVG, OBP, SLG, wOBA, xwOBA, 'wRC+', WAR } }
async function scrapeFangraphs(year, startDate, endDate) {
  const url =
    `https://www.fangraphs.com/leaders-legacy.aspx?pos=all&stats=bat&lg=all` +
    `&qual=0&type=8&season=${year}&month=1000&season1=${year}&ind=0` +
    `&team=&rost=&age=&filter=&players=` +
    `&startdate=${startDate}&enddate=${endDate}&page=1_1500`

  console.log(`  FanGraphs ${year}...`)
  const html = await fetch(url, { headers: { mode: 'no-cors' } }).then(r => r.text())
  const $ = load(html)

  // Dynamically parse column headers from the last header row
  const headers = []
  $('.rgMasterTable thead tr').last().find('th').each((_, el) => {
    headers.push($(el).text().trim())
  })

  const WANT = new Set(['G', 'PA', 'HR', 'R', 'RBI', 'AVG', 'OBP', 'SLG', 'wOBA', 'xwOBA', 'wRC+', 'WAR'])

  const result = {}
  $('.rgMasterTable tbody tr').each((_, row) => {
    const cells = $(row).find('td')
    const name = $(cells.eq(1)).find('a').text().trim()
    if (!name) return

    const stats = {}
    cells.each((j, cell) => {
      const col = headers[j]
      if (col && WANT.has(col)) {
        stats[col] = $(cell).text().trim()
      }
    })
    result[name] = stats
  })

  console.log(`    → ${Object.keys(result).length} players found`)
  return result
}

// ─── Baseball Savant (exit velocity) ─────────────────────────────────────────

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

// Returns { [playerName]: avgEV }
async function scrapeExitVelocity(year) {
  const url =
    `https://baseballsavant.mlb.com/leaderboard/statcast` +
    `?type=batter&year=${year}&position=&team=&min=1&csv=true`

  console.log(`  Baseball Savant ${year}...`)
  const csv = await fetch(url).then(r => r.text())

  const lines = csv.trim().split('\n')
  if (lines.length < 2) {
    console.warn('    → empty response from Savant')
    return {}
  }

  const headers = parseCSVLine(lines[0])
  const lastIdx = headers.indexOf('last_name')
  const firstIdx = headers.indexOf('first_name')
  // Newer Savant CSVs combine into a single "last_name, first_name" column
  const combinedNameIdx = headers.indexOf('last_name, first_name')
  // Savant has used both names for this column across years
  const evIdx = headers.findIndex(h =>
    h === 'avg_exit_velocity' || h === 'avg_hit_speed' || h === 'launch_speed'
  )
  const paIdx = headers.indexOf('pa')
  const abIdx = headers.indexOf('ab')

  const hasNameCols = (lastIdx !== -1 && firstIdx !== -1) || combinedNameIdx !== -1
  if (!hasNameCols) {
    console.warn('    → could not find name columns. headers:', headers.slice(0, 10))
    return {}
  }
  if (evIdx === -1) {
    console.warn('    → could not find exit velocity column. headers:', headers.join(', '))
    return {}
  }

  console.log(`    → EV column: "${headers[evIdx]}"`)

  const result = {}
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const cols = parseCSVLine(lines[i])
    let fullName
    if (combinedNameIdx !== -1) {
      // Format is "Last, First" — split on first comma
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
      const lastName = cols[lastIdx] || ''
      const firstName = cols[firstIdx] || ''
      fullName = `${firstName} ${lastName}`.trim()
    }
    const ev = parseFloat(cols[evIdx])
    const pa = paIdx !== -1 ? parseInt(cols[paIdx], 10) : null
    const ab = abIdx !== -1 ? parseInt(cols[abIdx], 10) : null
    if (fullName && !isNaN(ev)) {
      result[fullName] = { avgEV: ev, PA: pa, AB: ab }
    }
  }

  console.log(`    → ${Object.keys(result).length} players found`)
  return result
}

// ─── Name matching ────────────────────────────────────────────────────────────

// Strips suffixes and diacritics for fuzzy matching
function normalize(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/\s+(Jr\.|Sr\.|II|III)$/i, '')
    .toLowerCase()
    .trim()
}

function lookupPlayer(targetName, statsMap) {
  if (statsMap[targetName]) return statsMap[targetName]
  const normTarget = normalize(targetName)
  for (const [key, val] of Object.entries(statsMap)) {
    if (normalize(key) === normTarget) return val
  }
  return null
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const output = {}
  for (const { Name, cost } of PLAYERS) {
    output[Name] = { cost, seasons: {} }
  }

  for (const { year, startDate, endDate } of SEASONS) {
    console.log(`\nSeason ${year}`)

    const [fgStats, evStats] = await Promise.all([
      scrapeFangraphs(year, startDate, endDate),
      scrapeExitVelocity(year),
    ])

    let matched = 0
    for (const { Name } of PLAYERS) {
      const fg = lookupPlayer(Name, fgStats)
      const ev = lookupPlayer(Name, evStats)

      if (fg) {
        output[Name].seasons[year] = {
          G:      fg['G']    ?? null,
          PA:     fg['PA']   ?? null,
          AB:     ev?.AB     ?? null,   // AB comes from Savant; FanGraphs dashboard has PA not AB
          HR:     fg['HR']   ?? null,
          R:      fg['R']    ?? null,
          RBI:    fg['RBI']  ?? null,
          AVG:    fg['AVG']  ?? null,
          OBP:    fg['OBP']  ?? null,
          SLG:    fg['SLG']  ?? null,
          wOBA:   fg['wOBA'] ?? null,
          xwOBA:  fg['xwOBA'] ?? null,
          'wRC+': fg['wRC+'] ?? null,
          WAR:    fg['WAR']  ?? null,
          avgEV:  ev?.avgEV  ?? null,
        }
        matched++
      } else {
        output[Name].seasons[year] = null
      }
    }

    console.log(`  Matched ${matched}/${PLAYERS.length} players for ${year}`)
  }

  // Quick coverage summary
  console.log('\nCoverage summary:')
  let missing2024 = [], missing2025 = []
  for (const [name, data] of Object.entries(output)) {
    if (!data.seasons[2024]) missing2024.push(name)
    if (!data.seasons[2025]) missing2025.push(name)
  }
  if (missing2024.length) console.log(`  No 2024 stats (${missing2024.length}): ${missing2024.slice(0, 5).join(', ')}${missing2024.length > 5 ? '...' : ''}`)
  if (missing2025.length) console.log(`  No 2025 stats (${missing2025.length}): ${missing2025.slice(0, 5).join(', ')}${missing2025.length > 5 ? '...' : ''}`)

  const outPath = 'scripts/player-analysis-2026.json'
  writeFileSync(outPath, JSON.stringify(output, null, 2))
  console.log(`\nWrote ${outPath}`)
}

main().catch(console.error)
