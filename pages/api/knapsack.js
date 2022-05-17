
// Initialize all K(0, j) = 0 and all K(w, 0) = 0
// for j = 1 to n:
//   for w = 1 to W:
//     if wj > w: K(w, j) = K(w, j − 1)
//     else: K(w, j) = max{K(w, j − 1), K(w − wj, j − 1) + vj}
// return K(W, n)

import playersWithCosts from "../../constants/playersWithCosts"
import { getHomeRunData } from "./baseball"

async function fetchAllPlayerData({ month, year }) {
  const players = playersWithCosts.map((p) => p.Name)
  const hrData = await getHomeRunData({ month, year, players })
  const playersData = playersWithCosts.map(({ Name, cost }) => ({
    Name,
    cost: Number(cost),
    currentHRs: Number(hrData[Name])
  }))
  return playersData
}

export async function fetchOptimalTeam({ month, year }) {
  const players = await fetchAllPlayerData({ month, year })
  const optimal = knapsack({ players, budget: 161 })
  return optimal
}

function knapsack({ budget, players }) {
  // initalize with null for 1 indexing
  const costs = [null]
  const values = [null]
  players.forEach(player => {
    costs.push(player.cost)
    values.push(player.currentHRs)
  })
  console.log({ costs, values })
  const maxPlayers = 7

  // initialize table
  const K = Array.from(Array(players.length + 1), () => Array(players.length + 1))
  for (let n = 0; n <= players.length; n++) {
    for (let w = 0; w < costs.length; w++) {
      K[n][w] = new Array(maxPlayers + 1).fill(0);
    }
  }

  for (let n = 1; n <= players.length ; n++) {
    for (let w = 1; w < costs.length; w++) {
      for (let p = 1; p <= maxPlayers; p++) {
        if (w >= costs[n]) {
          const includedVal = K[n - 1][w - costs[n]][p - 1] + values[n]
          const skippedVal = K[n - 1][w][p]
          K[n][w][p] = Math.max(includedVal, skippedVal)
        } else {
          K[n][w][p] = K[n - 1][w][p]
        }
        // if (costs[n] > w) {
        //   K[n][w][p] = K[n - 1][w][p]
        // } else {
        //   const includedVal = K[n - 1][w - costs[n]][p - 1] + values[n]
        //   const skippedVal = K[n - 1][w][p]
        //   K[n][w][p] = Math.max(includedVal, skippedVal)
        // }
      }
    }
  }

  const maxHRs = K[players.length][budget][maxPlayers]
  console.log({ maxHRs })
  // lookback

  const optimal = {
    roster: [],
    score: 0,
  } 
  let totalCost = 0
  let k = maxPlayers
  let j = budget
  let i = players.length - 1
  while (optimal.roster.length < maxPlayers) {
    let currentTotal = K[i][j][k]
    while (currentTotal === K[i][j][k]) {
      i = i - 1
    }
    const prevPlayerIdx = i + 1
    const player = players[prevPlayerIdx - 1]
    console.log({ name: player.Name, cost: player.cost })
    totalCost += player.cost
    optimal.roster.push([player.Name, player.currentHRs])
    j -= player.cost
    k -= 1
  }
  optimal.score = optimal.roster.reduce((sum, p) => {
    return sum + p[1]
  }, optimal.score)
  console.log({ maxScore: optimal.score, totalCost, roster: optimal.roster })
  return optimal

  
  // costs.forEach((_, w) => {
  //   row = []
  //   values.forEach((_, j) => {
  //     const val = j === 0 || w === 0 ? 0 : null
  //     row.push(val)
  //   })
  //   K.push(row)
  // })

  // for (let j = 1; j < values.length; j++) {
  //   for (let w = 1; w < costs.length; w++) {
  //     if (costs[j] > w) {
  //       K[w][j] = K[w][j - 1]
  //     } else {
  //       const includedVal = K[w - costs[j]][j - 1] + values[j]
  //       const skippedVal = K[w][j - 1]
  //       K[w][j] = Math.max(includedVal, skippedVal)
  //     }
  //   }
  // }


}

export default async function handler(req, res) {
  const hrData = await fetchOptimalTeam({ month: req.query.month, year: month.query.year })

  res.json(data)
}