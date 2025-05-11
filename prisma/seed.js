import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Crear roles básicos
  const roles = [
    { name: 'User' },
    { name: 'Admin' },
    { name: 'Promoter' }
  ]

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    })
  }

  console.log('Roles creados correctamente')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 