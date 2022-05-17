
// Initialize all K(0, j) = 0 and all K(w, 0) = 0
// for j = 1 to n:
//   for w = 1 to W:
//     if wj > w: K(w, j) = K(w, j − 1)
//     else: K(w, j) = max{K(w, j − 1), K(w − wj, j − 1) + vj}
// return K(W, n)

import { byHomeRuns } from "../../components/useSortable"
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
  const maxPlayers = 7

  // initialize table
  const K = Array.from(Array(players.length + 1), () => Array(players.length + 1))
  for (let n = 0; n <= players.length; n++) {
    for (let w = 0; w < costs.length; w++) {
      K[n][w] = new Array(maxPlayers + 1).fill(0);
    }
  }

  // Filling the table
  for (let n = 1; n <= players.length ; n++) {
    for (let w = 1; w < costs.length; w++) {
      for (let p = 1; p <= maxPlayers; p++) {
        // If we can afford the player, decide if it's worth it
        if (w >= costs[n]) {
          const includedVal = K[n - 1][w - costs[n]][p - 1] + values[n]
          const skippedVal = K[n - 1][w][p]
          K[n][w][p] = Math.max(includedVal, skippedVal)
        } else {
        // can't afford this player, so skip
          K[n][w][p] = K[n - 1][w][p]
        }
      }
    }
  }

  const maxHRs = K[players.length][budget][maxPlayers]

  // lookback

  // structuring response object to match frontend props format
  const optimal = {
    roster: [],
    score: 0,
  }

  let totalCost = 0

  // Start with our indices initilized at the values that point to our solution
  let k = maxPlayers
  let j = budget
  let i = players.length - 1

  // Loop runs until we have bavkfilled the entire team
  while (optimal.roster.length < maxPlayers) {
    // see what our current total is
    let currentTotal = K[i][j][k]
    // keep backtracking the player index until our value changes: 
    // this means that we picked the previous player
    while (currentTotal === K[i][j][k]) {
      i = i - 1
    }
    // our previous player is the index right before this
    const prevPlayerIdx = i + 1

    // -1 to acount for the 0/1 indexing mismatch
    const player = players[prevPlayerIdx - 1]
    optimal.roster.push([player.Name, player.currentHRs])
    // decrement our cost index by the players cost, decrement the roster index by 1
    j -= player.cost
    k -= 1

    totalCost += player.cost
  }

  // bookkeeping: 
  // - compute the score and verifying it matches our computed max score earlier
  optimal.score = optimal.roster.reduce((sum, p) => {
    return sum + p[1]
  }, optimal.score)

  // Throw an error if we messed up and dont match the conditions
  if (optimal.score !== maxHRs) throw 'Score doesn\'t match!'
  if (totalCost > budget) throw 'Total cost exceeds budget!'

  optimal.roster = optimal.roster.sort(byHomeRuns)
  return optimal
}

export default async function handler(req, res) {
  const hrData = await fetchOptimalTeam({ month: req.query.month, year: month.query.year })

  res.json(data)
}