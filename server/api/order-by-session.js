import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey)

  const { session_id } = getQuery(event)

  if (!session_id) {
    throw createError({ statusCode: 400, message: 'session_id es requerido' })
  }

  try {
    // 1. Recuperamos la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (!session?.metadata) {
      throw createError({ statusCode: 400, message: 'Metadata no encontrada en la sesión' })
    }

    const { firebaseUid, userEmail, eventId, quantity } = session.metadata

    if (!firebaseUid || !eventId || !userEmail) {
      throw createError({ statusCode: 400, message: 'Faltan datos en metadata' })
    }

    // 2. Buscar usuario por firebaseUid
    const user = await prisma.user.findUnique({
      where: { firebaseUid }
    })

    if (!user) {
      throw createError({ statusCode: 404, message: 'Usuario no encontrado' })
    }

    // 3. Verificamos si ya hay orden asociada a ese session_id
    let order = await prisma.order.findFirst({
      where: {
        payments: {
          some: {
            checkoutSessionId: session_id
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
      // 4. Creamos la orden, el pago y los tickets
      const createdPayment = await prisma.payment.create({
        data: {
          checkoutSessionId: session_id,
          amount: parseInt(session.amount_total / 100),
          currency: session.currency
        }
      })

      order = await prisma.order.create({
        data: {
          userId: user.id,
          totalAmount: parseInt(session.amount_total / 100),
          payments: { connect: { id: createdPayment.id } },
          tickets: {
            create: Array.from({ length: parseInt(quantity) }).map(() => ({
              qr: crypto.randomUUID(),
              event: { connect: { id: parseInt(eventId) } }
            }))
          }
        },
        include: {
          tickets: true,
          payments: true,
          user: true
        }
      })
    }

    return { order }

  } catch (error) {
    console.error('❌ Error en order-by-session:', error)
    throw createError({ statusCode: 500, message: 'Error al procesar la orden' })
  }
})
