import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') // si tu ruta es /api/dashboard/[id]

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Falta el ID del evento'
    })
  }

  try {
    await prisma.event.delete({
      where: { id: Number(id) }
    })

    return { success: true }
  } catch (error) {
    console.error('Error eliminando evento:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al eliminar el evento'
    })
  }
})
