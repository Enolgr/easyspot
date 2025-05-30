import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'PATCH') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  const body = await readBody(event)
  const { firebaseUid, eventId } = body

  if (!firebaseUid || !eventId) {
    throw createError({ 
      statusCode: 400, 
      message: 'firebaseUid y eventId son requeridos' 
    })
  }

  try {
    // Buscar usuario por firebaseUid
    const user = await prisma.user.findUnique({
      where: { firebaseUid }
    })

    if (!user) {
      throw createError({ 
        statusCode: 404, 
        message: 'Usuario no encontrado' 
      })
    }

    // Buscar todos los tickets del usuario para este evento
    const tickets = await prisma.ticket.findMany({
      where: {
        userId: user.id,
        eventId: parseInt(eventId)
      }
    })

    if (tickets.length === 0) {
      throw createError({ 
        statusCode: 404, 
        message: 'No se encontraron tickets para este evento' 
      })
    }

    // Regenerar QR para cada ticket
    const updatedTickets = await Promise.all(
      tickets.map(ticket => 
        prisma.ticket.update({
          where: { id: ticket.id },
          data: {
            qr: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
          }
        })
      )
    )


    return { 
      success: true, 
      message: `${updatedTickets.length} códigos QR regenerados correctamente`,
      tickets: updatedTickets.map(ticket => ({
        id: ticket.id,
        qr: ticket.qr,
        validate: ticket.validate,
        validatedAt: ticket.validatedAt
      }))
    }

  } catch (error) {
    console.error('❌ Error al regenerar códigos QR:', error)
    throw createError({ 
      statusCode: 500, 
      message: error.message || 'Error interno al regenerar códigos QR' 
    })
  } finally {
    await prisma.$disconnect()
  }
})
