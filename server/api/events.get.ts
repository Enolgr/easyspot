import { PrismaClient } from "@prisma/client";
import { defineEventHandler, getQuery } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Obtenemos los parámetros de consulta
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const skip = (page - 1) * limit;

  // Obtenemos los eventos paginados
  const events = await prisma.event.findMany({
    skip,
    take: limit,
    include: {
      venue: true,
    },
  });

  // Contamos el total de eventos para la metadata de paginación
  const total = await prisma.event.count();

  return {
    data: events,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
});
