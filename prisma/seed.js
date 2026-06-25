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

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJETOS NOVOS (spec) — limpa e recria dados de exemplo
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\nSeeding projetos novos (spec)...\n')

  // Limpeza em ordem de dependência (filhos → pais) para reexecução idempotente.
  await prisma.gameLike.deleteMany()
  await prisma.game.deleteMany()
  await prisma.gameCategory.deleteMany()
  await prisma.vehicleRegistration.deleteMany()
  await prisma.carEvent.deleteMany()
  await prisma.purchaseItem.deleteMany()
  await prisma.purchase.deleteMany()
  await prisma.clothingStock.deleteMany()
  await prisma.clothingProduct.deleteMany()
  await prisma.clothingCategory.deleteMany()
  await prisma.clothingSize.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.electronicProduct.deleteMany()
  await prisma.electronicCategory.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.match.deleteMany()
  await prisma.team.deleteMany()
  await prisma.group.deleteMany()
  await prisma.news.deleteMany()
  await prisma.beach.deleteMany()
  await prisma.surfEvent.deleteMany()

  // 1. Dentro do Jogo (Copa 2026)
  console.log('⚽ Dentro do Jogo...')
  const groupA = await prisma.group.create({ data: { name: 'Grupo A', description: 'Seleções do Grupo A' } })
  const groupB = await prisma.group.create({ data: { name: 'Grupo B', description: 'Seleções do Grupo B' } })
  const brasil = await prisma.team.create({ data: { name: 'Brasil', countryCode: 'BRA', groupId: groupA.id, wins: 2, draws: 1, points: 7, goalsFor: 6, goalsAgainst: 2 } })
  const servia = await prisma.team.create({ data: { name: 'Sérvia', countryCode: 'SRB', groupId: groupA.id, wins: 1, losses: 2, points: 3, goalsFor: 3, goalsAgainst: 5 } })
  const argentina = await prisma.team.create({ data: { name: 'Argentina', countryCode: 'ARG', groupId: groupB.id, wins: 3, points: 9, goalsFor: 7, goalsAgainst: 1 } })
  const mexico = await prisma.team.create({ data: { name: 'México', countryCode: 'MEX', groupId: groupB.id, draws: 1, losses: 2, points: 1, goalsFor: 2, goalsAgainst: 6 } })
  await prisma.match.create({ data: { homeTeamId: brasil.id, awayTeamId: servia.id, homeScore: 2, awayScore: 0, matchDate: new Date('2026-06-14T16:00:00Z'), stadium: 'Estádio Azteca', city: 'Cidade do México', stage: 'Fase de Grupos', status: 'Encerrado' } })
  await prisma.match.create({ data: { homeTeamId: argentina.id, awayTeamId: mexico.id, matchDate: new Date('2026-06-28T20:00:00Z'), stadium: 'MetLife Stadium', city: 'Nova York', stage: 'Fase de Grupos', status: 'Agendado' } })
  await prisma.news.createMany({
    data: [
      { title: 'Brasil vence na estreia', content: 'A seleção brasileira começou bem a Copa com uma atuação sólida.', summary: 'Brasil 2 x 0 Sérvia.', author: 'Redação Dentro do Jogo', publishedAt: new Date('2026-06-14T19:00:00Z'), category: 'Resultados' },
      { title: 'Argentina lidera o Grupo B', content: 'Com três vitórias, a Argentina garantiu a liderança antecipada.', summary: 'Argentina com 9 pontos.', author: 'Redação Dentro do Jogo', publishedAt: new Date('2026-06-27T12:00:00Z'), category: 'Seleções' }
    ]
  })

  // 2. Pitoco's Car
  console.log('🚗 Pitoco\'s Car...')
  const carEvent = await prisma.carEvent.create({ data: { title: 'Encontro de Clássicos 2026', organizerName: 'Pitoco Garage', organizerBio: 'Apaixonados por carros antigos.', eventDate: new Date('2026-09-12T09:00:00Z'), description: 'Exposição de carros clássicos e esportivos.', vehicleLimit: 50, ticketPrice: 30.0, ticketDescription: 'Inteira' } })
  await prisma.carEvent.create({ data: { title: 'Track Day Esportivos', organizerName: 'Speed Club', organizerBio: 'Eventos de pista para entusiastas.', eventDate: new Date('2026-10-05T08:00:00Z'), description: 'Dia de pista para carros esportivos.', vehicleLimit: 30 } })
  await prisma.vehicleRegistration.createMany({
    data: [
      { eventId: carEvent.id, ownerName: 'Carlos Silva', ownerEmail: 'carlos@example.com', vehicleName: 'Maverick GT', vehicleYear: 1974, vehicleDescription: 'V8 restaurado.', status: 'Aprovado' },
      { eventId: carEvent.id, ownerName: 'Ana Souza', ownerEmail: 'ana@example.com', vehicleName: 'Fusca 1300', vehicleYear: 1972, vehicleDescription: 'Original de fábrica.', status: 'Pendente' }
    ]
  })

  // 3. Lumière
  console.log('👗 Lumière...')
  const catCamisetas = await prisma.clothingCategory.create({ data: { name: 'Camisetas', description: 'Camisetas casuais' } })
  const catCalcas = await prisma.clothingCategory.create({ data: { name: 'Calças', description: 'Calças e jeans' } })
  const sizeP = await prisma.clothingSize.create({ data: { label: 'P' } })
  const sizeM = await prisma.clothingSize.create({ data: { label: 'M' } })
  const sizeG = await prisma.clothingSize.create({ data: { label: 'G' } })
  const prodCamiseta = await prisma.clothingProduct.create({ data: { name: 'Camiseta Básica', description: '100% algodão', price: 49.9, categoryId: catCamisetas.id } })
  const prodJeans = await prisma.clothingProduct.create({ data: { name: 'Calça Jeans Slim', description: 'Jeans premium', price: 159.9, categoryId: catCalcas.id } })
  await prisma.clothingStock.createMany({
    data: [
      { productId: prodCamiseta.id, sizeId: sizeP.id, quantity: 10 },
      { productId: prodCamiseta.id, sizeId: sizeM.id, quantity: 15 },
      { productId: prodCamiseta.id, sizeId: sizeG.id, quantity: 8 },
      { productId: prodJeans.id, sizeId: sizeM.id, quantity: 5 },
      { productId: prodJeans.id, sizeId: sizeG.id, quantity: 7 }
    ]
  })

  // 4. Nexus
  console.log('💻 Nexus...')
  const catNote = await prisma.electronicCategory.create({ data: { name: 'Notebooks', description: 'Computadores portáteis' } })
  const catPerif = await prisma.electronicCategory.create({ data: { name: 'Periféricos', description: 'Teclados, mouses e mais' } })
  await prisma.electronicProduct.createMany({
    data: [
      { name: 'Notebook Pro 14', categoryId: catNote.id, brand: 'Acme', description: '16GB RAM, SSD 512GB', price: 5999.9, stockQuantity: 12, lowStockThreshold: 3, sku: 'NB-PRO-14' },
      { name: 'Teclado Mecânico RGB', categoryId: catPerif.id, brand: 'KeyCo', description: 'Switch blue', price: 349.9, stockQuantity: 2, lowStockThreshold: 5, sku: 'KB-MEC-RGB' },
      { name: 'Mouse Gamer 16000DPI', categoryId: catPerif.id, brand: 'KeyCo', description: 'Sensor óptico de alta precisão', price: 199.9, stockQuantity: 25, lowStockThreshold: 5, sku: 'MS-GMR-16K' }
    ]
  })
  await prisma.customer.create({ data: { name: 'Cliente Demo', email: 'cliente@nexus.com', password: await bcrypt.hash('cliente123', 10), phone: '11999990000', address: 'Rua Demo, 100' } })

  // 5. Maxblock
  console.log('🎮 Maxblock...')
  const gcArcade = await prisma.gameCategory.create({ data: { name: 'Arcade' } })
  const gcPuzzle = await prisma.gameCategory.create({ data: { name: 'Puzzle' } })
  await prisma.game.createMany({
    data: [
      { name: 'Space Blaster', description: 'Atire nos aliens e defenda a galáxia.', categoryId: gcArcade.id, ageRating: 'Livre', controls: 'Setas + Espaço', likesCount: 42, gameUrl: 'https://games.example.com/space-blaster' },
      { name: 'Block Puzzle', description: 'Encaixe as peças e limpe as linhas.', categoryId: gcPuzzle.id, ageRating: '10+', controls: 'Mouse', likesCount: 17, gameUrl: 'https://games.example.com/block-puzzle' },
      { name: 'Neon Racer', description: 'Corrida futurista em alta velocidade.', categoryId: gcArcade.id, ageRating: '12+', controls: 'WASD', likesCount: 88, gameUrl: 'https://games.example.com/neon-racer' }
    ]
  })

  // 6. Swell Point
  console.log('🏄 Swell Point...')
  await prisma.beach.createMany({
    data: [
      { name: 'Praia do Rosa', description: 'Ondas perfeitas para surf no litoral catarinense.' },
      { name: 'Joaquina', description: 'Point clássico de Florianópolis.' },
      { name: 'Maresias', description: 'Famosa no litoral norte de São Paulo.' }
    ]
  })
  await prisma.surfEvent.createMany({
    data: [
      { name: 'Open de Surf 2026', description: 'Etapa nacional do circuito.' },
      { name: 'Festival Longboard', description: 'Celebração do estilo clássico.' },
      { name: 'Night Surf', description: 'Surf noturno com pista iluminada.' }
    ]
  })

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
