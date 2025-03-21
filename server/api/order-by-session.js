import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Obtener el parámetro session_id desde la query string
  const { session_id } = getQuery(event);
  if (!session_id) {
    throw createError({ statusCode: 400, message: 'session_id es requerido' });
  }

  // Buscar la orden relacionada con el session_id en la tabla Payment
  const order = await prisma.order.findFirst({
    where: {
      payments: {
        some: {
          stripePaymentId: session_id,
        },
      },
    },
    include: { 
      tickets: true,
      payments: true,
      user: true,
    }
  });

  if (!order) {
    throw createError({ statusCode: 404, message: 'Orden no encontrada' });
  }

  return { order };
});
