// Initialize all K(0, j) = 0 and all K(w, 0) = 0
// for j = 1 to n:
//   for w = 1 to W:
//     if wj > w: K(w, j) = K(w, j − 1)
//     else: K(w, j) = max{K(w, j − 1), K(w − wj, j − 1) + vj}
// return K(W, n)

import type { NextApiRequest, NextApiResponse } from 'next'
import { byHomeRuns } from '../../components/useSortable'
import playersWithCosts2022 from '../../constants/playersWithCosts'
import playersWithCosts2023 from '../../constants/playersWithCosts2023'
import playersWithCosts2026 from '../../constants/playersWithCosts2026'
import { getHomeRunData } from './baseball'
import type { OptimalTeam, PlayerWithCost, RosterEntry } from '../../types'

interface PlayerData {
  Name: string
  cost: number
  currentHRs: number
}

interface KnapsackParams {
  budget: number
  players: PlayerData[]
}

async function fetchAllPlayerData({ month, year }: { month?: string; year: number }): Promise<PlayerData[]> {
  const playersWithCosts: PlayerWithCost[] = year === 2026
    ? playersWithCosts2026
    : year === 2023
    ? playersWithCosts2023
    : playersWithCosts2022
  const players = playersWithCosts.map(p => p.Name)
  const hrData = await getHomeRunData({ month, year, players })

  return playersWithCosts.map(({ Name, cost }) => ({
    Name,
    cost: Number(cost),
    currentHRs: Number(hrData[Name])
  }))
}

export async function fetchOptimalTeam({ month, year }: { month?: string; year: number }): Promise<OptimalTeam> {
  const budget = year === 2026 ? 153 : 161
  const players = await fetchAllPlayerData({ month, year })
  try {
    return knapsack({ players, budget })
  }
  catch (e) {
    return { score: 0, roster: [], error: String(e) }
  }
}

function knapsack({ budget, players }: KnapsackParams): OptimalTeam {
  // initialize with null for 1 indexing
  const costs: (number | null)[] = [null]
  const values: (number | null)[] = [null]
  players.forEach(player => {
    costs.push(player.cost)
    values.push(player.currentHRs)
  })
  const maxPlayers = 7

  // initialize table
  const K: number[][][] = Array.from(Array(players.length + 1), () => Array(players.length + 1))
  for (let n = 0; n <= players.length; n++) {
    for (let b = 0; b < costs.length; b++) {
      K[n][b] = new Array(maxPlayers + 1).fill(0)
    }
  }

  // Filling the table
  for (let n = 1; n <= players.length; n++) {
    for (let b = 1; b < costs.length; b++) {
      for (let p = 1; p <= maxPlayers; p++) {
        const playerCost = costs[n] as number
        const playerValue = values[n] as number
        // If we can afford the player, decide if it's worth it
        if (b >= playerCost) {
          const includedVal = K[n - 1][b - playerCost][p - 1] + playerValue
          const skippedVal = K[n - 1][b][p]
          K[n][b][p] = Math.max(includedVal, skippedVal)
        } else {
          // can't afford this player, so skip
          K[n][b][p] = K[n - 1][b][p]
        }
      }
    }
  }

  const maxHRs = K[players.length][budget][maxPlayers]

  // structuring response object to match frontend props format
  const optimal: OptimalTeam = {
    roster: [],
    score: 0,
  }

  let totalCost = 0

  // Start with our indices initialized at the values that point to our solution
  let p = maxPlayers
  let b = budget
  let n = players.length - 1

  // Loop runs until we have backfilled the entire team
  while (optimal.roster.length < maxPlayers) {
    // see what our current total is
    const currentTotal = K[n][b][p]
    // keep backtracking the player index until our value changes:
    // this means that we picked the previous player
    while (currentTotal === K[n][b][p]) {
      n = n - 1
    }
    // our previous player is the index right before this
    const prevPlayerIdx = n + 1

    // -1 to account for the 0/1 indexing mismatch
    const player = players[prevPlayerIdx - 1]
    optimal.roster.push([player.Name, player.currentHRs] as RosterEntry)
    // decrement our cost index by the players cost, decrement the roster index by 1
    b -= player.cost
    p -= 1

    totalCost += player.cost
  }

  // compute the score and verify it matches our computed max score earlier
  optimal.score = optimal.roster.reduce((sum, p) => {
    return sum + p[1]
  }, optimal.score)

  // Throw an error if we messed up and don't match the conditions
  if (optimal.score !== maxHRs) throw new Error("Score doesn't match!")
  if (totalCost > budget) throw new Error('Total cost exceeds budget!')

  optimal.roster = optimal.roster.sort(byHomeRuns)
  return optimal
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const month = Array.isArray(req.query.month) ? req.query.month[0] : req.query.month
    const year = Number(Array.isArray(req.query.year) ? req.query.year[0] : req.query.year)
    const hrData = await fetchOptimalTeam({ month, year })
    res.json(hrData)
  }
  catch (e) {
    res.json({ error: String(e) })
  }
}
