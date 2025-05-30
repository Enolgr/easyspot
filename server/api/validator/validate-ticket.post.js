import { PrismaClient } from '@prisma/client'
import { getHeader, readBody, createError } from 'h3'
import { getFirebaseAdmin } from '@/server/utils/firebase'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { qrCode, eventId } = body

    if (!qrCode || !eventId) {
      throw createError({ statusCode: 400, message: 'Código QR y ID del evento son requeridos' })
    }

    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!token) {
      throw createError({ statusCode: 401, message: 'Token requerido' })
    }

    const firebase = getFirebaseAdmin()
    const decoded = await firebase.auth().verifyIdToken(token)

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid }
    })

    if (!user?.promoter) {
      throw createError({ statusCode: 403, message: 'No autorizado' })
    }

    // Verificar que el usuario es promotor del evento
    const eventData = await prisma.event.findFirst({
      where: {
        id: parseInt(eventId),
        promoters: {
          some: { userId: user.id }
        }
      }
    })

    if (!eventData) {
      throw createError({ statusCode: 403, message: 'No tienes permisos para validar tickets de este evento' })
    }

    // Buscar el ticket por código QR
    const ticket = await prisma.ticket.findUnique({
      where: { qr: qrCode },
      include: {
        event: {
          include: {
            venue: true
          }
        },
        user: {
          select: {
            displayName: true,
            email: true
          }
        }
      }
    })

    if (!ticket) {
      return {
        success: false,
        status: 'invalid',
        message: 'Código QR no válido'
      }
    }

    // Verificar que el ticket pertenece al evento que se está validando
    if (ticket.eventId !== parseInt(eventId)) {
      return {
        success: false,
        status: 'wrong_event',
        message: 'Este ticket no pertenece a este evento',
        ticketEvent: ticket.event?.title
      }
    }

    // Verificar si el ticket ya fue validado
    if (ticket.validate) {
      return {
        success: false,
        status: 'already_validated',
        message: 'Este ticket ya ha sido validado',
        validatedAt: ticket.validatedAt,
        ticket: {
          id: ticket.id,
          qr: ticket.qr,
          eventTitle: ticket.event?.title,
          venue: ticket.event?.venue?.name,
          userDisplayName: ticket.user?.displayName,
          userEmail: ticket.user?.email
        }
      }
    }

    // Validar el ticket
    const validatedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        validate: true,
        validatedAt: new Date()
      },
      include: {
        event: {
          include: {
            venue: true
          }
        },
        user: {
          select: {
            displayName: true,
            email: true
          }
        }
      }
    })

    return {
      success: true,
      status: 'validated',
      message: 'Ticket validado correctamente',
      ticket: {
        id: validatedTicket.id,
        qr: validatedTicket.qr,
        eventTitle: validatedTicket.event?.title,
        venue: validatedTicket.event?.venue?.name,
        userDisplayName: validatedTicket.user?.displayName,
        userEmail: validatedTicket.user?.email,
        validatedAt: validatedTicket.validatedAt
      }
    }

  } catch (error) {
    console.error('Error al validar ticket:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al validar el ticket'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 