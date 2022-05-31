const $ = require('cheerio').default
console.log({ $ })
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

const fmt = (s = '', e = '') => `https://www.fangraphs.com/leaders.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season=2021&month=1000&season1=2021&ind=0&team=&rost=&age=&filter=&players=&startdate=${s}&enddate=${e}&page=1_1500`

const getEndDate = ({ year = 2021, monthInt, endOfMonth }) => {
  if (year === 2021) {
    return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '03' : endOfMonth }`
  }
  return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '04' : endOfMonth }`
}

const getUrl = ({ month, year }) => {
  if (!month) {
    return `https://www.fangraphs.com/leaders.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season=${year}&month=0&season1=${year}&ind=0&team=&rost=&age=&filter=&players=&startdate=$&enddate=&page=1_1500`
  }

  const int = ints[month]
  const endOfMonth = max[month]

  const startDate = `${year}-0${int}-01`
  const endDate = getEndDate({ year, monthInt: int, endOfMonth })
  const url = fmt(startDate, endDate)
  return url
}

async function getHomeRunData({ players, year }) {
  const url = getUrl({ year })
  const html = await fetch(url)
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

module.exports = function(players) {
  return getHomeRunData({ players, year: '2021'})
}