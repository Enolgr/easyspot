// server/api/dashboard/[id].delete.js

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { id } = event.context.params

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID requerido' })
  }

  try {
    await prisma.event.delete({
      where: { id: parseInt(id) }
    })

    return { success: true }
  } catch (error) {
    console.error('Error al eliminar evento:', error)
    throw createError({ statusCode: 500, message: 'Error interno al eliminar evento' })
  }
})
