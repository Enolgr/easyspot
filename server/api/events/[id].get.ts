import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getRouterParam, createError } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  const eventData = await prisma.event.findUnique({
    where: { id: Number(id) },
    include: { venue: true },
  });

  if (!eventData) {
    throw createError({ statusCode: 404, message: "Event not found" });
  }

  return { data: eventData };
});
