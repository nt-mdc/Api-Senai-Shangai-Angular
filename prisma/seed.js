const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

// Cada entrada: [name (2 nomes únicos), email, senha]
const admins = [
  ['Admin',              'admin@shanghai.com',         'admin123'],
  ['Andrey Luiz',        'andrey.luiz@shanghai.com',   'admin123'],
  ['Arthur Hammes',      'arthur.hammes@shanghai.com', 'admin123'],
  ['Bernardo Mello',     'bernardo.mello@shanghai.com','admin123'],
  ['Caio Lacerda',       'caio.lacerda@shanghai.com',  'admin123'],
  ['Danilo Thomaz',      'danilo.thomaz@shanghai.com', 'admin123'],
  ['Davi Emanuel',       'davi.emanuel@shanghai.com',  'admin123'],
  ['Davi Santana',       'davi.santana@shanghai.com',  'admin123'],
  ['Gabriel Machado',    'gabriel.machado@shanghai.com','admin123'],
  ['Gabriel Marques',    'gabriel.marques@shanghai.com','admin123'],
  ['Isaque Leonardo',    'isaque.leonardo@shanghai.com','admin123'],
  ['Jean Vieira',        'jean.vieira@shanghai.com',   'admin123'],
  ['Joao Gabriel',       'joao.gabriel@shanghai.com',  'admin123'],
  ['Julia Trindade',     'julia.trindade@shanghai.com','admin123'],
  ['Leonardo Lima',      'leonardo.lima@shanghai.com', 'admin123'],
  ['Luan Reis',          'luan.reis@shanghai.com',     'admin123'],
  ['Lucas Souza',        'lucas.souza@shanghai.com',   'admin123'],
  ['Luiz Carlos',        'luiz.carlos@shanghai.com',   'admin123'],
  ['Matheus Lutte',      'matheus.lutte@shanghai.com', 'admin123'],
  ['Matheus Velho',      'matheus.velho@shanghai.com', 'admin123'],
  ['Miguel Namyr',       'miguel.namyr@shanghai.com',  'admin123'],
  ['Pollyana Felicio',   'pollyana.felicio@shanghai.com','admin123'],
  ['Ramon Silva',        'ramon.silva@shanghai.com',   'admin123'],
  ['Ricardo Hartmann',   'ricardo.hartmann@shanghai.com','admin123'],
  ['Taiane Oliveira',    'taiane.oliveira@shanghai.com','admin123'],
  ['Vagner Davi',        'vagner.davi@shanghai.com',   'admin123'],
  ['Vinicius Francisco', 'vinicius.francisco@shanghai.com','admin123'],
  ['Vitor Machado',      'vitor.machado@shanghai.com', 'admin123'],
]

async function main() {
  console.log(`Seeding ${admins.length} admin users...\n`)

  for (const [name, email, password] of admins) {
    const password_hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, password_hash, role: 'admin' }
    })

    console.log(`✔ ${user.name.padEnd(22)} → ${user.email}`)
  }

  console.log('\nSeed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
