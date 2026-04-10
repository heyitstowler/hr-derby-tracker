const ints = {
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
}

const max = {
  april: 30,
  may: 31,
  june: 30,
  july: 31,
  august: 31,
  september: 30,
  october: 3,
}

const MARCH_DATES = {
  2023: '30',
  2026: '25',
}

const getEndDate = ({ year = 2021, monthInt, endOfMonth }) => {
  if (year === 2021) {
    return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '03' : endOfMonth}`
  } else if (year === 2022) {
    return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '04' : endOfMonth}`
  } else if (year === 2023) {
    return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '01' : endOfMonth}`
  }
  return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '01' : endOfMonth}`
}

const getStartDate = ({ month, year }) => {
  if (month === 4) {
    const marchDate = MARCH_DATES[year] || '25'
    return `${year}-03-${marchDate}`
  }
  return `${year}-0${month}-01`
}

const BASE = 'https://statsapi.mlb.com/api/v1/stats'

const getUrl = ({ month, year }) => {
  if (!month) {
    return `${BASE}?stats=season&group=hitting&season=${year}&playerPool=All&limit=600&sortStat=homeRuns`
  }

  const int = ints[month]
  const endOfMonth = max[month]
  const startDate = getStartDate({ month: int, year })
  const endDate = getEndDate({ year, monthInt: int, endOfMonth })
  return `${BASE}?stats=byDateRange&group=hitting&startDate=${startDate}&endDate=${endDate}&season=${year}&playerPool=All&limit=600&sortStat=homeRuns`
}

const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

async function getHomeRunData({ players, year, month }) {
  const url = getUrl({ month, year })
  console.log({ url })

  const json = await fetch(url).then(r => r.json())
  const splits = json?.stats?.[0]?.splits ?? []

  const normalizedPlayers = new Map(players.map(p => [normalize(p), p]))

  const map = {}
  splits.forEach(split => {
    const apiName = split?.player?.fullName
    if (!apiName) return
    const playerName = normalizedPlayers.get(normalize(apiName))
    if (playerName) {
      map[playerName] = split.stat.homeRuns ?? 0
    }
  })

  players.forEach(p => {
    if (map[p] === undefined) {
      map[p] = 0
    }
  })
  return map
}

module.exports = function(players, year = '2021', month) {
  return getHomeRunData({ players, year, month })
}
