const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shanghai.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@shanghai.com',
      password_hash: passwordHash,
      role: 'admin'
    }
  })

  console.log('Seed completed. Admin user created:', { id: admin.id, email: admin.email })
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
