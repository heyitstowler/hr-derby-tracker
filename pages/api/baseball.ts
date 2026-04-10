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

const getEndDate = ({ year = 2021, monthInt, endOfMonth }: { year?: number; monthInt: number; endOfMonth: number }): string => {
  if (year === 2021) {
    return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '03' : endOfMonth}`
  }
  else if (year === 2022) {
    return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '04' : endOfMonth}`
  }
  else if (year === 2023) {
    return `${year}-${monthInt >= 9 ? 10 : '0' + monthInt}-${monthInt >= 9 ? '01' : endOfMonth}`
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

const BASE = 'https://statsapi.mlb.com/api/v1/stats'

const getUrl = ({ month, year }: { month?: string; year: number }): string => {
  if (!month) {
    return `${BASE}?stats=season&group=hitting&season=${year}&playerPool=All&limit=600&sortStat=homeRuns`
  }

  const int = ints[month]
  const endOfMonth = max[month]
  const startDate = getStartDate({ month: int, year })
  const endDate = getEndDate({ year, monthInt: int, endOfMonth })
  return `${BASE}?stats=byDateRange&group=hitting&startDate=${startDate}&endDate=${endDate}&season=${year}&playerPool=All&limit=600&sortStat=homeRuns`
}

interface GetHomeRunDataParams {
  month?: string
  year: number
  players?: string[]
}

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export async function getHomeRunData({ month, year, players: override }: GetHomeRunDataParams): Promise<HRData> {
  const players: string[] = override ?? PLAYERS[year] ?? PLAYERS.default
  const url = getUrl({ month, year })
  console.log({ url })

  const json = await fetch(url).then(r => r.json())
  const splits: { player: { fullName: string }; stat: { homeRuns: number } }[] = json?.stats?.[0]?.splits ?? []

  // Build a normalized lookup so accent differences (e.g. "José Ramírez" vs "Jose Ramirez") still match
  const normalizedPlayers = new Map<string, string>(players.map(p => [normalize(p), p]))

  const map: HRData = {}
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const month = Array.isArray(req.query.month) ? req.query.month[0] : req.query.month
  const year = Number(Array.isArray(req.query.year) ? req.query.year[0] : req.query.year)
  const data = await getHomeRunData({ month, year })
  res.json(data)
}
