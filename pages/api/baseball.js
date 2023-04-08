import $ from 'cheerio'

import PLAYERS from '../../constants/players'

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

const fmt = (s = '', e = '', y = '') => `https://www.fangraphs.com/leaders.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season=${y}&month=1000&season1=${y}&ind=0&team=&rost=&age=&filter=&players=&startdate=${s}&enddate=${e}&page=1_1500`

const getEndDate = ({ year = 2021, monthInt, endOfMonth }) => {
  if (year === 2021) {
    return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '03' : endOfMonth }`
  }
  else if (year === 2022) {
    return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '04' : endOfMonth }`
  }
  return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '01' : endOfMonth }`

}

const getUrl = ({ month, year }) => {
  if (!month) {
    return `https://www.fangraphs.com/leaders.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season=${year}&month=0&season1=${year}&ind=0&team=&rost=&age=&filter=&players=&startdate=$&enddate=&page=1_1500`
  }

  const int = ints[month]
  const endOfMonth = max[month]
  const startDate = year === 2023 && int === 4
    ? `${year}-03-30`
    : `${year}-0${int}-01`
  console.log({startDate, month, year, int})
  const endDate = getEndDate({ year, monthInt: int, endOfMonth })
  const url = fmt(startDate, endDate, year)
  return url
}

export async function getHomeRunData({ month, year, players: override }) {
  const players = override || PLAYERS[year] || PLAYERS.default
  const url = getUrl({ month, year })
  const html = await fetch(url, { headers: { mode: 'no-cors' }})
    .then(r => r.text())
  const rows = Array.from($('.rgMasterTable tbody tr', html)).map(
    row => row.children.filter(el => el && el.name === 'td')
  )
  if (!rows) {
    console.log('ruh roh')
  }

  const playerRows = rows.filter(row => {
    const name = row[1]?.children?.[0]?.children?.[0]?.data
    return players.includes(name)
  })
  const data = playerRows.map(row => {
    const name = row[1]?.children?.[0]?.children?.[0]?.data
    const hrs = row[5]?.children?.[0]?.data
    return { name, hrs }
  })
  const map = data.reduce((accum, { name, hrs }) => {
    accum[name] = hrs
    return accum
  }, {})
  players.forEach(p => {
    if (!map[p]) {
      map[p] = 0
    }
  })
  return map
}

export default async function handler(req, res) {
  const data = await getHomeRunData({ month: req.query.month, year: month.query.year, })
  res.json(data)
}