import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getQuery } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const rawQuery = getQuery(event).query || ''
  const query = rawQuery.toLowerCase()

  if (query.length < 2) {
    return { results: [] }
  }

  const results = await prisma.event.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { city: { contains: query } }
      ]
    },
    take: 10,
    include: { venue: true }
  })

  return { results }
})
