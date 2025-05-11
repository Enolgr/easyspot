import { PrismaClient } from "@prisma/client";
import { defineEventHandler, getQuery } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const skip = (page - 1) * limit;

  const now = new Date(); // Fecha actual

  const events = await prisma.event.findMany({
    where: {
      dateTime: {
        gt: now
      }
    },
    skip,
    take: limit,
    include: {
      venue: true,
    },
    orderBy: {
      dateTime: 'asc' 
    }
  });

  const total = await prisma.event.count({
    where: {
      dateTime: {
        gt: now
      }
    }
  });

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
