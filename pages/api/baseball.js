import $ from 'cheerio'

import PLAYERS from '../../constants/players'

export async function getHomeRunData() {
  const url = 'https://www.fangraphs.com/leaders.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season=2021&month=0&season1=2021&ind=0&team=&rost=&age=&filter=&players=&startdate=&enddate=&page=1_1000'
  const html = await fetch(url)
    .then(r => r.text())
  const rows = Array.from($('.rgMasterTable tbody tr', html)).map(
    row => row.children.filter(el => el && el.name === 'td')
  )
  const playerRows = rows.filter(row => {
    const name = row[1]?.children?.[0]?.children?.[0]?.data
    return PLAYERS.includes(name)
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
  PLAYERS.forEach(p => {
    if (!map[p]) {
      map[p] = 0
    }
  })
  return map
}

export default async function handler(req, res) {
  const data = await getHomeRunData()
  res.json(data)
}