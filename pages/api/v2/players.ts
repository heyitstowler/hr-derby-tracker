import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getPlayers = async () => {
  const players = await prisma.player.findMany()
  return players
}

export default async (req, res) => {
  const players = await getPlayers()
  res.statusCode = 200
  res.json({ players })
}
