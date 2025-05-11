import { PrismaClient } from "@prisma/client";
import { defineEventHandler, getQuery } from "h3";
import { createError } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Obtenemos los parámetros de consulta
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    // Obtenemos los eventos con su conteo de tickets
    const events = await prisma.event.findMany({
      where: {
        dateTime: {
          gte: new Date()
        }
      },
      include: {
        venue: true,
        _count: {
          select: {
            tickets: true
          }
        }
      },
      orderBy: {
        tickets: {
          _count: 'desc'
        }
      },
      skip,
      take: limit
    });

    // Transformamos los datos para tener una estructura más limpia
    const transformedEvents = events.map(event => ({
      ...event,
      ticketsSold: event._count.tickets,
      _count: undefined // Eliminamos el campo _count de la respuesta
    }));

    // Contamos el total de eventos futuros
    const total = await prisma.event.count({
      where: {
        dateTime: {
          gte: new Date()
        }
      }
    });

    return {
      data: transformedEvents,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error en popular-events:', error);
    throw createError({
      statusCode: 500,
      message: 'Error al obtener los eventos populares'
    });
  }
});
