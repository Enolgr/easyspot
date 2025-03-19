import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody, createError } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Verificamos si el método es POST
  if (event.node.req.method !== 'POST') {
    throw createError({ statusCode: 405, message: 'Method Not Allowed' });
  }

  // Obtenemos el cuerpo de la petición
  const body = await readBody(event);

  try {
    // Decide si vas a CREAR o CONECTAR el venue
    // 1) Si el cliente envía body.venueId, conectamos a un venue existente.
    // 2) Si envía body.venue con la info necesaria, creamos un venue nuevo.
    let venueRelation;
    
    // 1) Conectar un venue existente
    if (body.venueId) {
      venueRelation = {
        connect: { id: Number(body.venueId) }, // O BigInt(body.venueId) si lo prefieres
      };
    }
    // 2) Crear un venue nuevo
    else if (body.venue) {
      venueRelation = {
        create: {
          name: body.venue.name,
          city: body.venue.city,
          address: body.venue.address,
          capacity: body.venue.capacity,
          contactDetails: body.venue.contactDetails,
        },
      };
    }

    // Creamos el nuevo evento
    const newEvent = await prisma.event.create({
      data: {
        title: body.title,
        dateTime: new Date(body.dateTime),
        city: body.city,
        price: body.price,
        availableTickets: body.availableTickets,
        description: body.description,
        poster: body.poster,
        venue: venueRelation,
      },
    });

    return {
      success: true,
      data: newEvent,
    };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: (error as Error).message,
    });
  }
});
