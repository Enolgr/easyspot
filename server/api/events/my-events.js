import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { firebaseUid } = getQuery(event)

  if (!firebaseUid) {
    throw createError({
      statusCode: 400,
      message: 'Falta el UID del usuario'
    })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Usuario no encontrado'
      })
    }

    const tickets = await prisma.ticket.findMany({
      where: { userId: user.id },
      include: {
        event: {
          include: {
            venue: true 
          }
        },
        order: true
      }
    })

    const events = tickets.map(ticket => ({
      ticketId: ticket.id,
      qr: ticket.qr,
      purchaseDate: ticket.purchaseDate,
      validate: ticket.validate,
      validatedAt: ticket.validatedAt,
      orderId: ticket.orderId,
      event: {
        id: ticket.event.id,
        title: ticket.event.title,
        dateTime: ticket.event.dateTime,
        city: ticket.event.city,
        price: ticket.event.price,
        poster: ticket.event.poster,
        venue: {
          name: ticket.event.venue?.name || null,
          city: ticket.event.venue?.city || null
        }
      }
    }))

    return { events }
  } catch (err) {
    console.error('❌ Error en /api/my-events:', err)
    throw createError({ statusCode: 500, message: 'Error al recuperar eventos del usuario' })
  }
})
