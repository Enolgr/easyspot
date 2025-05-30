import { PrismaClient } from '@prisma/client'
import admin from 'firebase-admin'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const eventId = getRouterParam(event, 'id')
    const authHeader = getHeader(event, 'authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token de autorización requerido'
      })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await admin.auth().verifyIdToken(token)
    const firebaseUid = decodedToken.uid

    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        promoters: {
          include: {
            event: {
              include: {
                venue: true,
                category: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Usuario no encontrado'
      })
    }

    // Verificar que el usuario tiene eventos de promotor
    if (!user.promoters || user.promoters.length === 0) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tienes permisos de promotor'
      })
    }

    // Buscar el evento específico entre los eventos del promotor
    const promoterEvent = user.promoters.find(p => p.eventId === parseInt(eventId))

    if (!promoterEvent) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tienes permisos para acceder a este evento'
      })
    }

    // Devolver la información del evento
    const eventData = promoterEvent.event

    return {
      id: eventData.id,
      title: eventData.title,
      description: eventData.description,
      dateTime: eventData.dateTime,
      city: eventData.city,
      price: eventData.price,
      availableTickets: eventData.availableTickets,
      venue: eventData.venue?.name,
      venueName: eventData.venue?.name,
      venueId: eventData.venueId,
      categoryId: eventData.categoryId,
      category: eventData.category?.name
    }

  } catch (error) {
    console.error('Error al obtener evento del promotor:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
}) 