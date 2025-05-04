import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const venues = await prisma.venue.findMany({
    select: {
      id: true,
      name: true,
      city: true,
      capacity: true
    }
  })
  return venues
})
