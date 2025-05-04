import { readMultipartFormData, getHeader } from 'h3'
import { PrismaClient } from '@prisma/client'
import { getFirebaseAdmin } from '@/server/utils/firebase'
import { uploadPoster } from '@/server/utils/uploadPoster.js'

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

  const formData = await readMultipartFormData(event)
  const fields = {}
  let fileBuffer = null
  let fileType = null
  let fileName = null

  for (const part of formData) {
    if (part.filename) {
      fileBuffer = Buffer.from(await part.data)
      fileType = part.filename?.split('.').pop()
      fileName = part.filename
    } else {
      fields[part.name] = part.data.toString()
    }
  }

  console.log('▶️ Campos del formulario:', fields)
  console.log('📂 Archivo recibido:', fileName)
  console.log('🧪 Buffer?', !!fileBuffer, 'Tipo:', fileType)

  let posterUrl = null
  if (fileBuffer && fileType) {
    try {
      posterUrl = await uploadPoster(fileBuffer, fileType, fileName)
      console.log('✅ Imagen subida:', posterUrl)
    } catch (error) {
      console.error('❌ Error al subir la imagen a Firebase:', error)
    }
  } else {
    console.warn('⚠️ No se recibió archivo válido para subir.')
  }

  let venueId = fields.venueId ? parseInt(fields.venueId) : null

  if (!venueId && fields.venueName && fields.venueCity) {
    const newVenue = await prisma.venue.create({
      data: {
        name: fields.venueName,
        city: fields.venueCity,
        capacity: parseInt(fields.venueCapacity || '10000')
      }
    })
    venueId = newVenue.id
  }

  const created = await prisma.event.create({
    data: {
      title: fields.title,
      description: fields.description,
      city: fields.city,
      dateTime: new Date(`${fields.date}T${fields.time}`),
      price: parseFloat(fields.price),
      availableTickets: parseInt(fields.totalTickets),
      category: fields.category || null,
      poster: posterUrl,
      venue: { connect: { id: venueId } },
      promoters: {
        create: {
          user: { connect: { id: user.id } },
          role: { connect: { id: 2 } }
        }
      }
    }
  })

  console.log('🎉 Evento creado:', created)
  return created
})
