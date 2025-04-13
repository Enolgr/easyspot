import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { session_id } = getQuery(event)

  if (!session_id) {
    throw createError({ statusCode: 400, message: 'session_id es requerido' })
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        payments: {
          some: {
            checkoutSessionId: session_id, // ✅ CAMBIO AQUÍ
          }
        }
      },
      include: {
        tickets: true,
        payments: true,
        user: true
      }
    })

    if (!order) {
      throw createError({ statusCode: 404, message: 'Orden no encontrada' })
    }

    return { order }
  } catch (error) {
    console.error('Error al buscar la orden por session_id:', error)
    throw createError({ statusCode: 500, message: 'Error interno del servidor' })
  }
})
