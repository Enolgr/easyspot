// server/api/users.post.js
import { PrismaClient } from '@prisma/client'
import { setResponseStatus } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('Datos recibidos:', body)

  try {
    // Desestructuramos "uid" en lugar de "firebaseUid"
    const { uid, email, displayName, photoURL } = body

    // Usamos "uid" para asignar a firebaseUid
    const newUser = await prisma.user.create({
      data: { 
        firebaseUid: uid,
        email,
        displayName,
        phoneNumber: null 
      }
    })
    console.log('Usuario creado:', newUser)
    return newUser
  } catch (error) {
    console.error('Error creando usuario:', error)
    setResponseStatus(event, 500)
    return { error: error.message }
  }
})
