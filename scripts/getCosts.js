const playerLists = require('./playerList')
const getCosts = require('./getStats')
const fs = require('fs')

const players = playerLists.map(({ Name }) => {
  return Name
})

getCosts(players).then(costMap => {
  const fullMap = playerLists.map((player) => {
    const cost = costMap[player.Name]
    return { ...player, cost }
  })
  
  fs.writeFileSync('playersWithCosts.js', `export default ${JSON.stringify(fullMap)}`)
})
