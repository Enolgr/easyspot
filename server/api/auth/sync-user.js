import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, uid, displayName } = body

  if (!email || !uid) {
    throw createError({ statusCode: 400, message: 'Faltan datos del usuario' })
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      firebaseUid: uid,
      displayName,
    }
  })

  return { status: 'ok', user }
})
