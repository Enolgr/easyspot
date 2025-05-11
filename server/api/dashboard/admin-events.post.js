import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readMultipartFormData, getHeader } from 'h3'
import { getAuth } from 'firebase-admin/auth'
import { uploadPoster } from '@/server/utils/uploadPoster'

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

    // Extraer datos del formulario
    const title = formData.find(f => f.name === 'title')?.data.toString()
    const description = formData.find(f => f.name === 'description')?.data.toString()
    const date = formData.find(f => f.name === 'date')?.data.toString()
    const time = formData.find(f => f.name === 'time')?.data.toString()
    const city = formData.find(f => f.name === 'city')?.data.toString()
    const price = parseFloat(formData.find(f => f.name === 'price')?.data.toString())
    const totalTickets = parseInt(formData.find(f => f.name === 'totalTickets')?.data.toString())
    const categoryId = formData.find(f => f.name === 'categoryId')?.data.toString()
    const venueId = formData.find(f => f.name === 'venueId')?.data.toString()
    const venueName = formData.find(f => f.name === 'venueName')?.data.toString()
    const venueCity = formData.find(f => f.name === 'venueCity')?.data.toString()
    const venueCapacity = formData.find(f => f.name === 'venueCapacity')?.data.toString()
    const venueAddress = formData.find(f => f.name === 'venueAddress')?.data.toString()
    const posterFile = formData.find(f => f.name === 'poster')

    // Validar datos requeridos
    if (!title || !description || !date || !time || !city || !price || !totalTickets) {
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
        where: { id: parseInt(venueId) }
      })
      if (!venue) {
        throw new Error('Recinto no encontrado')
      }
    } else if (venueName) {
      venue = await prisma.venue.create({
        data: {
          name: venueName,
          city: venueCity || city,
          capacity: parseInt(venueCapacity) || 10000,
          address: venueAddress || ''
        }
      })
    } else {
      throw new Error('Se requiere un recinto')
    }

    // Subir poster si existe
    let posterUrl = null
    if (posterFile) {
      posterUrl = await uploadPoster(posterFile.data, posterFile.filename?.split('.').pop() || 'jpg', posterFile.filename)
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
        categoryId: categoryId || null,
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
