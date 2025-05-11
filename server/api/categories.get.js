import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true
      }
    })
    
    if (!categories || categories.length === 0) {
      return []
    }
    
    return categories
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener las categorías'
    })
  }
}) 