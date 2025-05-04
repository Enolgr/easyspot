import { PrismaClient } from '@prisma/client'
import { getHeader } from 'h3'
import { getFirebaseAdmin } from '@/server/utils/firebase'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw createError({ statusCode: 401, message: 'Token requerido' })

  const firebase = getFirebaseAdmin()
  const decoded = await firebase.auth().verifyIdToken(token)

  const user = await prisma.user.findUnique({
    where: { firebaseUid: decoded.uid }
  })

  if (!user?.promoter) throw createError({ statusCode: 403, message: 'No autorizado' })

  const events = await prisma.event.findMany({
    where: {
      promoters: {
        some: { userId: user.id }
      }
    },
    include: {
      venue: true,
      tickets: true
    }
  })

  return events.map(e => ({
    ...e,
    ticketsSold: e.tickets.length,
    totalTickets: e.availableTickets,
    revenue: e.tickets.length * Number(e.price),
    venue: e.venue?.name || ''
  }))
})
