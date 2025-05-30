import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, getHeader, createError, getRouterParam } from 'h3'
import { getAuth } from 'firebase-admin/auth'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    console.log('Iniciando actualización de evento...')

    const eventId = getRouterParam(event, 'id')
    if (!eventId) throw new Error('No se proporcionó ID del evento')

    const authHeader = getHeader(event, 'Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No se proporcionó token de autenticación')
    }

    const token = authHeader.split(' ')[1]
    const decodedToken = await getAuth().verifyIdToken(token)

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
      include: { role: true }
    })

    if (!user || user.role.name !== 'Promoter') {
      throw new Error('No tienes permisos para editar eventos')
    }

    const eventToUpdate = await prisma.event.findFirst({
      where: {
        id: parseInt(eventId),
        promoters: {
          some: { userId: user.id }
        }
      }
    })

    if (!eventToUpdate) {
      throw new Error('No tienes permisos para editar este evento')
    }

    const body = await readBody(event)
    const { title, description, date, time, city, price, totalTickets, categoryId, venueId } = body

    if (!title || !description || !date || !time || !city || !price || !totalTickets) {
      throw new Error('Faltan campos requeridos')
    }

    const dateTime = new Date(`${date}T${time}`)
    if (isNaN(dateTime.getTime())) {
      throw new Error('Fecha o hora inválida')
    }

    console.log('Fecha a guardar:', {
      crudo: `${date}T${time}`,
      dateTimeString: dateTime.toString(),
      dateTimeISO: dateTime.toISOString()
    })

    if (venueId) {
      const venue = await prisma.venue.findUnique({
        where: { id: parseInt(venueId) }
      })
      if (!venue) throw new Error('Recinto no encontrado')
    }

    const updateData = {
      title,
      description,
      dateTime,
      city,
      price: parseFloat(price),
      availableTickets: parseInt(totalTickets, 10),
      categoryId: categoryId ? parseInt(categoryId, 10) : null,
      venueId: venueId ? parseInt(venueId, 10) : null
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: updateData,
      include: {
        venue: true,
        tickets: true,
        promoters: { include: { role: true } }
      }
    })

    return {
      success: true,
      data: {
        ...updatedEvent,
        ticketsSold: updatedEvent.tickets.length,
        totalTickets: updatedEvent.availableTickets,
        revenue: updatedEvent.tickets.length * Number(updatedEvent.price),
        venue: updatedEvent.venue?.name || ''
      }
    }
  } catch (error) {
    console.error('Error al actualizar evento:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Error al actualizar el evento'
    })
  } finally {
    await prisma.$disconnect()
  }
})
