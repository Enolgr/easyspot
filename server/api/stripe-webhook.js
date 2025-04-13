export const config = {
  bodyParser: false
}

import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const runtimeConfig = useRuntimeConfig()
const stripe = new Stripe(runtimeConfig.stripeSecretKey)

export default defineEventHandler(async (event) => {
  const sig = event.node.req.headers['stripe-signature']
  const rawBody = event.node.req.rawBody || await readRawBody(event)

  let stripeEvent

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('❌ Firma inválida de Stripe:', err.message)
    throw createError({ statusCode: 400, message: `Webhook Error: ${err.message}` })
  }

  const { type, data } = stripeEvent
  const session = data.object

  if (type === 'checkout.session.completed') {
    console.log('✅ Webhook recibido - checkout.session.completed')
    console.log('📦 session.id:', session.id)

    const eventId = session.metadata?.eventId
    const quantity = parseInt(session.metadata?.quantity || '1')
    const stripePaymentId = session.payment_intent
    const sessionId = session.id
    const amountTotal = session.amount_total
    const firebaseUid = session.metadata?.firebaseUid
    const userEmail = session.metadata?.userEmail

    console.log('📨 Datos recibidos:', {
      eventId,
      quantity,
      stripePaymentId,
      sessionId,
      amountTotal,
      userEmail,
      firebaseUid
    })

    if (!eventId || !firebaseUid || !amountTotal) {
      console.error('⚠️ Webhook incompleto - Faltan datos')
      return
    }

    try {
      const user = await prisma.user.upsert({
        where: { firebaseUid },
        update: { email: userEmail },
        create: {
          firebaseUid,
          email: userEmail
        }
      })
      console.log('👤 Usuario verificado/creado')

      await prisma.event.update({
        where: { id: parseInt(eventId) },
        data: {
          availableTickets: { decrement: quantity }
        }
      })
      console.log('🎟️ Tickets disponibles actualizados')

      const order = await prisma.order.create({
        data: {
          user: { connect: { id: user.id } },
          totalAmount: amountTotal / 100,
          status: 'paid'
        }
      })
      console.log('🧾 Orden creada')

      await prisma.payment.create({
        data: {
          order: { connect: { id: order.id } },
          stripePaymentId,
          checkoutSessionId: sessionId,
          paymentStatus: 'paid'
        }
      })
      console.log('💳 Pago registrado')

      const ticketsToCreate = Array.from({ length: quantity }).map(() => ({
        user: { connect: { id: user.id } },
        event: { connect: { id: parseInt(eventId) } },
        order: { connect: { id: order.id } },
        qr: `$${Date.now()}${Math.random().toString(36).substring(2, 12)}`
      }))

      await Promise.all(
        ticketsToCreate.map((ticket) =>
          prisma.ticket.create({ data: ticket })
        )
      )
      console.log(`🎫 ${quantity} ticket(s) generados para ${userEmail}`)

      console.log('✅ Todo guardado con éxito para', userEmail)

    } catch (err) {
      console.error('❌ Error al guardar en base de datos:', err)
      throw createError({ statusCode: 500, message: 'Error interno al procesar el pago' })
    }
  } else {
    console.log(`ℹ️ Webhook recibido (${type}) - sin acción`)
  }

  return { received: true }
})
