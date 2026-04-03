import * as cheerio from 'cheerio'
import type { NextApiRequest, NextApiResponse } from 'next'
import PLAYERS from '../../constants/players'
import type { HRData } from '../../types'

const ints: Record<string, number> = {
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
}

const max: Record<string, number> = {
  april: 30,
  may: 31,
  june: 30,
  july: 31,
  august: 31,
  september: 30,
  october: 3,
}

const fmt = (s = '', e = '', y: string | number = '') =>
  `https://www.fangraphs.com/leaders-legacy.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season=${y}&month=1000&season1=${y}&ind=0&team=&rost=&age=&filter=&players=&startdate=${s}&enddate=${e}&page=1_1500`

const getEndDate = ({ year = 2021, monthInt, endOfMonth }: { year?: number; monthInt: number; endOfMonth: number }): string => {
  if (year === 2021) {
    return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '03' : endOfMonth}`
  }
  else if (year === 2022) {
    return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '04' : endOfMonth}`
  }
  return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '01' : endOfMonth}`
}

const MARCH_DATES: Record<number, string> = {
  2023: '30',
  2026: '25'
}

const getStartDate = ({ month, year }: { month: number; year: number }): string => {
  if (month === 4) {
    const marchDate = MARCH_DATES[year] || '25'
    return `${year}-03-${marchDate}`
  }
  return `${year}-0${month}-01`
}

const getUrl = ({ month, year }: { month?: string; year: number }): string => {
  if (!month) {
    return `https://www.fangraphs.com/leaders-legacy.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season=${year}&month=0&season1=${year}&ind=0&team=&rost=&age=&filter=&players=&startdate=$&enddate=&page=1_1500`
  }

  const int = ints[month]
  const endOfMonth = max[month]
  const startDate = getStartDate({ month: int, year })
  const endDate = getEndDate({ year, monthInt: int, endOfMonth })
  return fmt(startDate, endDate, year)
}

interface GetHomeRunDataParams {
  month?: string
  year: number
  players?: string[]
}

export async function getHomeRunData({ month, year, players: override }: GetHomeRunDataParams): Promise<HRData> {
  const players: string[] = override ?? PLAYERS[year] ?? PLAYERS.default
  const url = getUrl({ month, year })
  const html = await fetch(url, { headers: { mode: 'no-cors' } })
    .then(r => r.text())

  const $ = cheerio.load(html)
  const rows = $('.rgMasterTable tbody tr').toArray()

  const playerRows = rows.filter(row => {
    const name = $(row).find('td').eq(1).find('a').text()
    return players.includes(name)
  })

  const data = playerRows.map(row => {
    const name = $(row).find('td').eq(1).find('a').text()
    const hrs = $(row).find('td').eq(5).text()
    return { name, hrs }
  })

  const map: HRData = data.reduce((accum: HRData, { name, hrs }) => {
    accum[name] = parseInt(hrs, 10)
    return accum
  }, {})

  players.forEach(p => {
    if (!map[p]) {
      map[p] = 0
    }
  })
  return map
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const month = Array.isArray(req.query.month) ? req.query.month[0] : req.query.month
  const year = Number(Array.isArray(req.query.year) ? req.query.year[0] : req.query.year)
  const data = await getHomeRunData({ month, year })
  res.json(data)
}
