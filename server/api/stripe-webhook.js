// server/api/stripe-webhook.js
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const config = useRuntimeConfig();
const stripe = new Stripe(config.stripeSecretKey);

export default defineEventHandler(async (event) => {
  // Es importante usar el raw body para verificar la firma del webhook
  const sig = event.node.req.headers['stripe-signature'];
  let stripeEvent;

  try {
    // Construir el evento verificando la firma
    stripeEvent = stripe.webhooks.constructEvent(
      event.req.rawBody, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw createError({ statusCode: 400, message: `Webhook Error: ${err.message}` });
  }

  // Procesar el evento de pago exitoso
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    
    // Extraer datos relevantes: puedes almacenar eventId en metadata y tener información de usuario
    const eventId = session.metadata.eventId;
    const quantity = session.metadata.quantity || 1; // Asegúrate de enviar esto en metadata si lo necesitas
    const stripePaymentId = session.payment_intent;
    const amountTotal = session.amount_total; // en céntimos

    // Supongamos que el usuario ya está autenticado o lo identificas mediante algún campo en metadata
    const userEmail = session.customer_details.email;

    try {
      // Actualizar el evento: descontar las entradas compradas
      await prisma.event.update({
        where: { id: parseInt(eventId) },
        data: { 
          availableTickets: { decrement: quantity }
        }
      });

      // Crear la orden
      const order = await prisma.order.create({
        data: {
          user: { connect: { email: userEmail } }, // Conectar con el usuario por email, asumiendo que ya existe
          totalAmount: amountTotal / 100, // convertir a euros
          status: 'paid',
        },
      });

      // Crear el pago relacionado a la orden
      await prisma.payment.create({
        data: {
          order: { connect: { id: order.id } },
          stripePaymentId,
          paymentStatus: 'paid',
        },
      });

      // Crear el ticket
      await prisma.ticket.create({
        data: {
          user: { connect: { email: userEmail } },
          event: { connect: { id: parseInt(eventId) } },
          ticketType: 'entrada', // o el tipo que corresponda
        },
      });
    } catch (dbError) {
      // Maneja errores de la base de datos
      console.error('Error al guardar la compra en la base de datos:', dbError);
      throw createError({ statusCode: 500, message: 'Error al procesar la compra' });
    }
  }

  return { received: true };
});
