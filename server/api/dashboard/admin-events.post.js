import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readMultipartFormData, getHeader, createError } from 'h3'
import { getAuth } from 'firebase-admin/auth'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw new Error('No se recibieron datos del formulario')
    }

    // Obtener el token del header
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
      throw new Error('No tienes permisos para crear eventos')
    }

    // Función auxiliar para extraer datos
    const getField = (name) => formData.find(f => f.name === name)?.data.toString() || ''

    // Extraer datos
    const title = getField('title')
    const description = getField('description')
    const date = getField('date')
    const time = getField('time')
    const city = getField('city')
    const price = parseFloat(getField('price'))
    const totalTickets = parseInt(getField('totalTickets'), 10)
    const categoryIdRaw = getField('categoryId')
    const categoryId = categoryIdRaw ? parseInt(categoryIdRaw, 10) : null
    if (categoryIdRaw && isNaN(categoryId)) {
      throw new Error('ID de categoría inválido')
    }
    const venueIdRaw = getField('venueId')
    const venueId = venueIdRaw ? parseInt(venueIdRaw, 10) : null
    const venueName = getField('venueName')
    const venueCity = getField('venueCity')
    const venueCapacityRaw = getField('venueCapacity')
    const venueCapacity = venueCapacityRaw ? parseInt(venueCapacityRaw, 10) : 10000
    const venueAddress = getField('venueAddress')
    const posterFile = formData.find(f => f.name === 'poster')

    // Validar datos requeridos
    if (!title || !description || !date || !time || !city || isNaN(price) || isNaN(totalTickets)) {
      throw new Error('Faltan campos requeridos')
    }

    // Procesar fecha y hora
    const dateTime = new Date(`${date}T${time}`)
    if (isNaN(dateTime.getTime())) {
      throw new Error('Fecha o hora inválida')
    }

    // Procesar recinto
    let venue
    if (venueId) {
      venue = await prisma.venue.findUnique({
        where: { id: venueId }
      })
      if (!venue) {
        throw new Error('Recinto no encontrado')
      }
    } else if (venueName) {
      venue = await prisma.venue.upsert({
        where: { name: venueName },
        update: {
          city: venueCity || city,
          capacity: venueCapacity,
          address: venueAddress || ''
        },
        create: {
          name: venueName,
          city: venueCity || city,
          capacity: venueCapacity,
          address: venueAddress || ''
        }
      })
    } else {
      throw new Error('Se requiere un recinto')
    }

    // Subir poster si existe
    let posterUrl = null
    if (posterFile) {
      posterUrl = await uploadPoster(
        posterFile.data,
        posterFile.filename?.split('.').pop() || 'jpg',
        posterFile.filename
      )
    }

    // Crear el evento
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        dateTime,
        city,
        price,
        availableTickets: totalTickets,
        poster: posterUrl,
        venueId: venue.id,
        categoryId,
        promoters: {
          create: {
            userId: user.id,
            roleId: user.roleId
          }
        }
      }
    })

    return newEvent
  } catch (error) {
    console.error('Error al crear evento:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Error al crear el evento'
    })
  }
})
