// server/api/stripe-checkout.js
import Stripe from 'stripe';

const config = useRuntimeConfig();
const stripe = new Stripe(config.stripeSecretKey);

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }

  const body = await readBody(event);
  const { eventId, quantity, userEmail, firebaseUid } = body;

  if (!eventId || !userEmail || !firebaseUid) {
    throw createError({ statusCode: 400, message: 'Faltan datos necesarios para procesar el pago' });
  }

  // Se obtiene la información del evento desde la API interna
  let eventData;
  try {
    eventData = await $fetch(`/api/events/${eventId}`);
  } catch (error) {
    throw createError({ statusCode: 500, message: 'No se pudo obtener la información del evento' });
  }

  const { title, description, poster, price, dateTime, venue } = eventData.data;

  const eventDate = new Date(dateTime);
  const options = {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: 'numeric', minute: 'numeric'
  };
  const formattedDateTime = new Intl.DateTimeFormat('es-ES', options).format(eventDate);
  const details = ` ${formattedDateTime} · Sala: ${venue.name}`;
  const unitAmount = Math.round(price * 100);

  const origin = event.node.req.headers.origin || 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: title,
            description: details,
            images: [poster]
          },
          unit_amount: unitAmount,
        },
        quantity,
      }],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/events/${eventId}`,
      metadata: {
        eventId,
        quantity,
        userEmail,
        firebaseUid
      }
    });

    return { sessionId: session.id };
  } catch (err) {
    throw createError({ statusCode: 500, message: err.message });
  }
});
