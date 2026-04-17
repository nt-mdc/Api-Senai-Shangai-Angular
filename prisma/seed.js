const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

const admins = [
  ['Admin',              'admin@shanghai.com',         'admin123'],
  ['Andrey Luiz',        'andrey.luiz@shanghai.com',   'admin123'],
  ['Arthur Hammes',      'arthur.hammes@shanghai.com', 'admin123'], 
  ['Bernardo Mello',     'bernardo.mello@shanghai.com','admin123'],
  ['Caio Lacerda',       'caio.lacerda@shanghai.com',  'admin123'],
]

async function main() {
  console.log(`Seeding admin users...\n`)
  let mainAdminId = null

  for (const [name, email, password] of admins) {
    const password_hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, password_hash, role: 'admin' }
    })

    if (email === 'admin@shanghai.com') mainAdminId = user.id
    console.log(`✔ ${user.name.padEnd(22)} → ${user.email}`)
  }

  console.log('\nSeeding project examples...\n')

  // 1. Amigo Fiel (Pets)
  console.log('🐾 Seeding Amigo Fiel...')
  const pets = [
    { name: 'Max', species: 'Cachorro', age: 2, size: 'Médio', description: 'Muito brincalhão e dócil.', status: 'disponivel' },
    { name: 'Luna', species: 'Gato', age: 1, size: 'Pequeno', description: 'Calma e gosta de carinho.', status: 'disponivel' },
    { name: 'Thor', species: 'Cachorro', age: 4, size: 'Grande', description: 'Protetor e leal.', status: 'adotado' },
  ]
  for (const pet of pets) {
    await prisma.pet.upsert({
      where: { id: pets.indexOf(pet) + 1 }, // Using fixed IDs for seeding
      update: pet,
      create: { ...pet, created_by: mainAdminId }
    })
  }

  // 2. EduTech (Courses)
  console.log('📚 Seeding EduTech...')
  const courses = [
    { title: 'Angular Pro', instructor: 'João Silva', category: 'Programação', workload: 40, price: 299.90, description: 'Domine Angular do zero ao avançado.' },
    { title: 'UI/UX Design', instructor: 'Maria Souza', category: 'Design', workload: 30, price: 199.00, description: 'Crie interfaces incríveis.' },
    { title: 'Marketing Digital', instructor: 'Pedro Santos', category: 'Marketing', workload: 25, price: 149.50, description: 'Estratégias para redes sociais.' },
  ]
  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: courses.indexOf(course) + 1 },
      update: course,
      create: { ...course, created_by: mainAdminId }
    })
  }

  // 3. EasyHome (Properties)
  console.log('🏠 Seeding EasyHome...')
  const properties = [
    { type: 'Apartamento', address: 'Av. Paulista, 1000', area: 75.5, price: 450000, modality: 'Venda', status: 'disponivel' },
    { type: 'Casa', address: 'Rua das Flores, 123', area: 150, price: 2500, modality: 'Aluguel', status: 'disponivel' },
    { type: 'Terreno', address: 'Loteamento Sol Nascente', area: 300, price: 120000, modality: 'Venda', status: 'vendido' },
  ]
  for (const property of properties) {
    await prisma.property.upsert({
      where: { id: properties.indexOf(property) + 1 },
      update: property,
      create: { ...property, created_by: mainAdminId }
    })
  }

  // 4. Chef\'s Menu (Dishes)
  console.log('🍽️ Seeding Chef\'s Menu...')
  const dishes = [
    { name: 'Feijoada Completa', category: 'Prato Principal', price: 45.00, description: 'Tradicional feijoada brasileira.', available: true },
    { name: 'Bolinha de Queijo', category: 'Entrada', price: 15.00, description: 'Porção com 10 unidades.', available: true },
    { name: 'Pudim de Leite', category: 'Sobremesa', price: 12.00, description: 'Caseiro e delicioso.', available: true },
  ]
  for (const dish of dishes) {
    await prisma.dish.upsert({
      where: { id: dishes.indexOf(dish) + 1 },
      update: dish,
      create: { ...dish, created_by: mainAdminId }
    })
  }

  // 5. Fitness Hub (Plans & Modalities)
  console.log('💪 Seeding Fitness Hub...')
  const plans = [
    { name: 'Plano Basic', type: 'Mensal', price: 89.90, weekly_frequency: 3, description: 'Acesso 3x por semana em qualquer horário.' },
    { name: 'Plano Silver', type: 'Semestral', price: 129.90, weekly_frequency: 5, description: 'Acesso 5x por semana com direito a uma aula coletiva.' },
    { name: 'Plano VIP', type: 'Anual', price: 199.90, weekly_frequency: 7, description: 'Acesso livre 24h e todas as modalidades inclusas.' },
  ]
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plans.indexOf(plan) + 1 },
      update: plan,
      create: { ...plan, created_by: mainAdminId }
    })
  }

  const modalities = [
    { name: 'Musculação', description: 'Treino de força com equipamentos modernos.', level: 'Todos os Níveis', status: 'ativa' },
    { name: 'Crossfit', description: 'Treino funcional de alta intensidade.', level: 'Intermediário', status: 'ativa' },
    { name: 'Yoga', description: 'Prática de meditação e alongamento.', level: 'Iniciante', status: 'ativa' },
  ]
  for (const modality of modalities) {
    await prisma.modality.upsert({
      where: { id: modalities.indexOf(modality) + 1 },
      update: modality,
      create: { ...modality, created_by: mainAdminId }
    })
  }

  // 6. Event-IT (Events)
  console.log('🎫 Seeding Event-IT...')
  const events = [
    { name: 'Workshop de Angular', category: 'Workshop', date_time: new Date('2026-10-15T14:00:00'), location: 'Auditório A / Online', max_capacity: 50, description: 'Aprenda Angular na prática.' },
    { name: 'Conferência Tech 2026', category: 'Conferência', date_time: new Date('2026-11-20T09:00:00'), location: 'Centro de Convenções', max_capacity: 500, description: 'As maiores tendências do ano.' },
    { name: 'Palestra: Futuro da IA', category: 'Palestra', date_time: new Date('2026-12-05T19:30:00'), location: 'Online via Zoom', max_capacity: 200, description: 'Impacto da IA no mercado de trabalho.' },
  ]
  for (const event of events) {
    await prisma.event.upsert({
      where: { id: events.indexOf(event) + 1 },
      update: event,
      create: { ...event, created_by: mainAdminId }
    })
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
