import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, uid, displayName } = body

  if (!email || !uid) {
    throw createError({
      statusCode: 400,
      message: 'Faltan datos del usuario'
    })
  }

  // Obtener el rol por defecto 'User'
  const defaultRole = await prisma.role.findUnique({
    where: { name: 'User' }
  })

  if (!defaultRole) {
    throw createError({
      statusCode: 500,
      message: 'El rol por defecto "User" no existe'
    })
  }

  // Crear o recuperar el usuario
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      firebaseUid: uid,
      displayName,
      roleId: defaultRole.id
    }
  })

  // Traer usuario con su rol completo
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true
    }
  })

  if (!user) {
    throw createError({
      statusCode: 500,
      message: 'Error al recuperar el usuario después del upsert'
    })
  }

  return {
    status: 'ok',
    user
  }
})
