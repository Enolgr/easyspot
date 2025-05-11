import { PrismaClient } from "@prisma/client";
import { defineEventHandler, getRouterParam, createError } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const categoryId = parseInt(getRouterParam(event, 'categoryId'), 10);

    if (isNaN(categoryId)) {
      throw createError({
        statusCode: 400,
        message: 'ID de categoría no válido'
      });
    }

    console.log('Buscando eventos para categoría:', categoryId);

    const events = await prisma.event.findMany({
      where: {
        categoryId: categoryId,
        dateTime: {
          gte: new Date()
        }
      },
      include: {
        venue: true,
        category: true,
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
      take: 3
    });


    const transformedEvents = events.map(event => ({
      ...event,
      ticketsSold: event._count.tickets,
      _count: undefined
    }));

    return transformedEvents;
  } catch (error) {
    console.error('Error en events/category:', error);
    throw createError({
      statusCode: 500,
      message: 'Error al obtener los eventos de la categoría'
    });
  }
}); 