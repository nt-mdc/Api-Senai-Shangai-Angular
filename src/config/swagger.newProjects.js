// Documentação OpenAPI dos 6 projetos novos (spec), mesclada em swagger.js.
// Convenções destes endpoints (diferentes dos legados):
//   • Resposta de item:   { data: <obj>, message: 'OK' }
//   • Resposta de lista:   { data: [<obj>], meta: { page, perPage, total, totalPages } }
//   • Validação:           HTTP 422  • Upload: multipart/form-data, campo `image`
//   • [AUTH]  → Bearer token  • [AUTH ADMIN] → Bearer token de admin (role=admin)

// ─── Helpers ─────────────────────────────────────────────────────────────────
const bearer = [{ bearerAuth: [] }]
const ref = (name) => ({ $ref: `#/components/schemas/${name}` })
const json = (schema) => ({ 'application/json': { schema } })
const dataEnvelope = (name) => ({ type: 'object', properties: { data: ref(name), message: { type: 'string', example: 'OK' } } })
const listEnvelope = (name) => ({ type: 'object', properties: { data: { type: 'array', items: ref(name) }, meta: ref('PaginationMeta') } })
const multipart = (properties, required) => ({ 'multipart/form-data': { schema: { type: 'object', ...(required ? { required } : {}), properties } } })
const img = { type: 'string', format: 'binary', description: 'jpg/png/webp, máx 2MB' }
const idParams = (type = 'integer') => [{ name: 'id', in: 'path', required: true, schema: { type } }]
const pageParams = [
  { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
  { name: 'perPage', in: 'query', schema: { type: 'integer', default: 15 } }
]
const r401 = { $ref: '#/components/responses/Unauthorized' }
const r403 = { $ref: '#/components/responses/Forbidden' }
const r404 = { $ref: '#/components/responses/NotFound' }
const r422 = { description: 'Dados inválidos (validação)', content: json(ref('Error')) }

// Gera os dois nós de um CRUD padrão: coleção (`/base`) e item (`/base/{id}`).
function crud ({ tag, schema, createProps, createRequired, listParams = [], guard = bearer, idType = 'integer', publicRead = true }) {
  const ids = idParams(idType)
  const readSec = publicRead ? {} : { security: guard }
  const collection = {
    get: { tags: [tag], summary: 'Listar', parameters: [...listParams, ...pageParams], ...readSec, responses: { 200: { description: 'OK', content: json(listEnvelope(schema)) } } },
    post: { tags: [tag], summary: 'Criar', security: guard, requestBody: { required: true, content: multipart(createProps, createRequired) }, responses: { 201: { description: 'Criado', content: json(dataEnvelope(schema)) }, 422: r422, 401: r401, 403: r403 } }
  }
  const item = {
    get: { tags: [tag], summary: 'Detalhe por ID', parameters: ids, ...readSec, responses: { 200: { description: 'OK', content: json(dataEnvelope(schema)) }, 404: r404 } },
    put: { tags: [tag], summary: 'Atualizar', security: guard, parameters: ids, requestBody: { content: multipart(createProps) }, responses: { 200: { description: 'Atualizado', content: json(dataEnvelope(schema)) }, 422: r422, 404: r404 } },
    patch: { tags: [tag], summary: 'Atualizar parcialmente', security: guard, parameters: ids, requestBody: { content: multipart(createProps) }, responses: { 200: { description: 'Atualizado' }, 404: r404 } },
    delete: { tags: [tag], summary: 'Remover', security: guard, parameters: ids, responses: { 200: { description: 'Removido' }, 404: r404 } }
  }
  return { collection, item }
}

const paths = {}
function addCrud (base, cfg) {
  const { collection, item } = crud(cfg)
  paths[base] = collection
  paths[`${base}/{id}`] = item
}

// ─── Tags ──────────────────────────────────────────────────────────────────
const tags = [
  { name: 'Dentro do Jogo', description: 'Portal Copa do Mundo FIFA 2026 — /api/dentro-do-jogo' },
  { name: "Pitoco's Car", description: 'Eventos de carros clássicos — /api/pitocos-car' },
  { name: 'Lumière', description: 'Loja de roupas — /api/lumiere' },
  { name: 'Nexus', description: 'Loja de eletrônicos — /api/nexus' },
  { name: 'Maxblock', description: 'Catálogo de jogos — /api/maxblock' },
  { name: 'Swell Point', description: 'Praias e eventos de surf — /api/swell-point' }
]

// ─── Schemas ─────────────────────────────────────────────────────────────────
const ts = { createdAt: { type: 'string', format: 'date-time' }, updatedAt: { type: 'string', format: 'date-time' } }
const imageUrl = { type: 'string', nullable: true, example: 'https://blob.vercel-storage.com/...' }

const schemas = {
  // Sobrescreve a paginação antiga (era per_page/total_pages).
  PaginationMeta: {
    type: 'object',
    properties: {
      page: { type: 'integer', example: 1 },
      perPage: { type: 'integer', example: 15 },
      total: { type: 'integer', example: 42 },
      totalPages: { type: 'integer', example: 3 }
    }
  },

  // ── Projeto 1 — Dentro do Jogo (sobrescreve schemas antigos da Copa) ──
  Group: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Grupo A' },
      description: { type: 'string', nullable: true },
      image_url: imageUrl,
      teams: { type: 'array', items: ref('Team') },
      ...ts
    }
  },
  Team: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Brasil' },
      countryCode: { type: 'string', example: 'BRA' },
      groupId: { type: 'integer', example: 1 },
      wins: { type: 'integer' }, losses: { type: 'integer' }, draws: { type: 'integer' },
      points: { type: 'integer' }, goalsFor: { type: 'integer' }, goalsAgainst: { type: 'integer' },
      goalDifference: { type: 'integer', description: 'Calculado: goalsFor - goalsAgainst' },
      image_url: imageUrl,
      ...ts
    }
  },
  Match: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      homeTeamId: { type: 'integer' }, awayTeamId: { type: 'integer' },
      homeScore: { type: 'integer', nullable: true }, awayScore: { type: 'integer', nullable: true },
      matchDate: { type: 'string', format: 'date-time' },
      stadium: { type: 'string' }, city: { type: 'string' },
      stage: { type: 'string', enum: ['Fase de Grupos', 'Oitavas', 'Quartas', 'Semifinal', 'Final'] },
      status: { type: 'string', enum: ['Agendado', 'Em andamento', 'Encerrado'] },
      image_url: imageUrl,
      homeTeam: ref('Team'), awayTeam: ref('Team'),
      ...ts
    }
  },
  News: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      title: { type: 'string' }, content: { type: 'string' }, summary: { type: 'string' },
      author: { type: 'string' },
      publishedAt: { type: 'string', format: 'date-time' },
      category: { type: 'string', enum: ['Resultados', 'Seleções', 'Jogadores', 'Curiosidades'] },
      image_url: imageUrl,
      ...ts
    }
  },

  // ── Projeto 2 — Pitoco's Car ──
  CarEvent: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      title: { type: 'string' }, organizerName: { type: 'string' }, organizerBio: { type: 'string' },
      organizer_photo_url: imageUrl,
      eventDate: { type: 'string', format: 'date-time' },
      description: { type: 'string' }, vehicleLimit: { type: 'integer' },
      ticketPrice: { type: 'number', nullable: true }, ticketDescription: { type: 'string', nullable: true },
      image_url: imageUrl,
      registeredCount: { type: 'integer', description: 'Inscrições Aprovadas (somente em GET /events/{id})' },
      availableSlots: { type: 'integer' },
      isFree: { type: 'boolean' },
      ...ts
    }
  },
  VehicleRegistration: {
    type: 'object',
    properties: {
      id: { type: 'integer' }, eventId: { type: 'integer' },
      ownerName: { type: 'string' }, ownerEmail: { type: 'string', format: 'email' },
      vehicleName: { type: 'string' }, vehicleYear: { type: 'integer' }, vehicleDescription: { type: 'string' },
      status: { type: 'string', enum: ['Pendente', 'Aprovado', 'Rejeitado'] },
      image_url: imageUrl,
      ...ts
    }
  },

  // ── Projeto 3 — Lumière ──
  ClothingCategory: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, description: { type: 'string', nullable: true }, image_url: imageUrl, products: { type: 'array', items: ref('ClothingProduct') }, ...ts } },
  ClothingProduct: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, description: { type: 'string', nullable: true }, price: { type: 'number' }, categoryId: { type: 'integer' }, image_url: imageUrl, stockBySize: { type: 'array', items: { type: 'object', properties: { sizeId: { type: 'integer' }, sizeLabel: { type: 'string' }, quantity: { type: 'integer' }, image_url: imageUrl } } }, ...ts } },
  ClothingSize: { type: 'object', properties: { id: { type: 'integer' }, label: { type: 'string', example: 'M' }, image_url: imageUrl, ...ts } },
  ClothingStock: { type: 'object', properties: { id: { type: 'integer' }, productId: { type: 'integer' }, sizeId: { type: 'integer' }, quantity: { type: 'integer' }, image_url: imageUrl, ...ts } },
  Purchase: { type: 'object', properties: { id: { type: 'integer' }, customerName: { type: 'string' }, customerEmail: { type: 'string', format: 'email' }, total: { type: 'number' }, status: { type: 'string', enum: ['Pendente', 'Pago', 'Cancelado'] }, image_url: imageUrl, items: { type: 'array', items: ref('PurchaseItem') }, ...ts } },
  PurchaseItem: { type: 'object', properties: { id: { type: 'integer' }, purchaseId: { type: 'integer' }, productId: { type: 'integer' }, sizeId: { type: 'integer' }, quantity: { type: 'integer' }, unitPrice: { type: 'number' }, image_url: imageUrl, ...ts } },

  // ── Projeto 4 — Nexus ──
  ElectronicCategory: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, description: { type: 'string', nullable: true }, image_url: imageUrl, products: { type: 'array', items: ref('ElectronicProduct') }, ...ts } },
  ElectronicProduct: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, categoryId: { type: 'integer' }, brand: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, stockQuantity: { type: 'integer' }, lowStockThreshold: { type: 'integer' }, lowStock: { type: 'boolean', description: 'stockQuantity <= lowStockThreshold' }, sku: { type: 'string' }, image_url: imageUrl, ...ts } },
  Customer: { type: 'object', description: 'O campo password nunca é retornado.', properties: { id: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string', format: 'email' }, phone: { type: 'string', nullable: true }, address: { type: 'string', nullable: true }, role: { type: 'string', example: 'customer' }, image_url: imageUrl, ...ts } },
  Order: { type: 'object', properties: { id: { type: 'integer' }, customerId: { type: 'integer' }, total: { type: 'number' }, status: { type: 'string', enum: ['Pendente', 'Pago', 'Enviado', 'Entregue', 'Cancelado'] }, image_url: imageUrl, items: { type: 'array', items: ref('OrderItem') }, ...ts } },
  OrderItem: { type: 'object', properties: { id: { type: 'integer' }, orderId: { type: 'integer' }, productId: { type: 'integer' }, quantity: { type: 'integer' }, unitPrice: { type: 'number' }, image_url: imageUrl, ...ts } },
  CartItem: { type: 'object', properties: { id: { type: 'integer' }, customerId: { type: 'integer' }, productId: { type: 'integer' }, quantity: { type: 'integer' }, lineTotal: { type: 'number' }, product: ref('ElectronicProduct'), image_url: imageUrl, ...ts } },

  // ── Projeto 5 — Maxblock ──
  GameCategory: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, image_url: imageUrl, games: { type: 'array', items: ref('Game') }, ...ts } },
  Game: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, description: { type: 'string' }, categoryId: { type: 'integer' }, ageRating: { type: 'string', enum: ['Livre', '10+', '12+', '14+', '16+', '18+'] }, controls: { type: 'string' }, likesCount: { type: 'integer' }, gameUrl: { type: 'string', format: 'uri' }, image_url: imageUrl, ...ts } },

  // ── Projeto 6 — Swell Point ──
  Beach: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, description: { type: 'string' }, image_url: imageUrl, ...ts } },
  SurfEvent: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, description: { type: 'string' }, image_url: imageUrl, ...ts } }
}

// ═══════════════════════════════════════════════════════════════════════════
// PATHS
// ═══════════════════════════════════════════════════════════════════════════

// ── Projeto 1 — Dentro do Jogo (/dentro-do-jogo) — escritas [AUTH] ──
addCrud('/dentro-do-jogo/groups', {
  tag: 'Dentro do Jogo', schema: 'Group',
  createProps: { name: { type: 'string' }, description: { type: 'string' }, image: img }, createRequired: ['name']
})
addCrud('/dentro-do-jogo/teams', {
  tag: 'Dentro do Jogo', schema: 'Team',
  listParams: [{ name: 'groupId', in: 'query', schema: { type: 'integer' } }],
  createProps: { name: { type: 'string' }, countryCode: { type: 'string', example: 'BRA' }, groupId: { type: 'integer' }, wins: { type: 'integer' }, losses: { type: 'integer' }, draws: { type: 'integer' }, points: { type: 'integer' }, goalsFor: { type: 'integer' }, goalsAgainst: { type: 'integer' }, image: img },
  createRequired: ['name', 'countryCode', 'groupId']
})
addCrud('/dentro-do-jogo/matches', {
  tag: 'Dentro do Jogo', schema: 'Match',
  listParams: [
    { name: 'stage', in: 'query', schema: { type: 'string', enum: ['Fase de Grupos', 'Oitavas', 'Quartas', 'Semifinal', 'Final'] } },
    { name: 'status', in: 'query', schema: { type: 'string', enum: ['Agendado', 'Em andamento', 'Encerrado'] } },
    { name: 'teamId', in: 'query', schema: { type: 'integer' } }
  ],
  createProps: { homeTeamId: { type: 'integer' }, awayTeamId: { type: 'integer' }, homeScore: { type: 'integer' }, awayScore: { type: 'integer' }, matchDate: { type: 'string', format: 'date-time' }, stadium: { type: 'string' }, city: { type: 'string' }, stage: { type: 'string' }, status: { type: 'string' }, image: img },
  createRequired: ['homeTeamId', 'awayTeamId', 'matchDate', 'stadium', 'city', 'stage']
})
addCrud('/dentro-do-jogo/news', {
  tag: 'Dentro do Jogo', schema: 'News',
  listParams: [{ name: 'category', in: 'query', schema: { type: 'string', enum: ['Resultados', 'Seleções', 'Jogadores', 'Curiosidades'] } }],
  createProps: { title: { type: 'string' }, content: { type: 'string' }, summary: { type: 'string' }, author: { type: 'string' }, publishedAt: { type: 'string', format: 'date-time' }, category: { type: 'string' }, image: img },
  createRequired: ['title', 'content', 'summary', 'author', 'publishedAt', 'category']
})

// ── Projeto 2 — Pitoco's Car (/pitocos-car) ──
const carEventBody = { title: { type: 'string' }, organizerName: { type: 'string' }, organizerBio: { type: 'string' }, eventDate: { type: 'string', format: 'date-time' }, description: { type: 'string' }, vehicleLimit: { type: 'integer' }, ticketPrice: { type: 'number' }, ticketDescription: { type: 'string' }, image: img, organizerPhoto: { type: 'string', format: 'binary', description: 'Foto do organizador' } }
paths['/pitocos-car/events'] = {
  get: { tags: ["Pitoco's Car"], summary: 'Listar eventos', parameters: [{ name: 'upcoming', in: 'query', schema: { type: 'boolean' }, description: 'true = apenas futuros' }, ...pageParams], responses: { 200: { description: 'OK', content: json(listEnvelope('CarEvent')) } } },
  post: { tags: ["Pitoco's Car"], summary: 'Criar evento (banner + foto do organizador)', security: bearer, requestBody: { required: true, content: multipart(carEventBody, ['title', 'organizerName', 'organizerBio', 'eventDate', 'description', 'vehicleLimit']) }, responses: { 201: { description: 'Criado', content: json(dataEnvelope('CarEvent')) }, 422: r422, 401: r401 } }
}
paths['/pitocos-car/events/{id}'] = {
  get: { tags: ["Pitoco's Car"], summary: 'Detalhe (com registeredCount, availableSlots, isFree)', parameters: idParams(), responses: { 200: { description: 'OK', content: json(dataEnvelope('CarEvent')) }, 404: r404 } },
  put: { tags: ["Pitoco's Car"], summary: 'Atualizar evento', security: bearer, parameters: idParams(), requestBody: { content: multipart(carEventBody) }, responses: { 200: { description: 'Atualizado' }, 404: r404 } },
  patch: { tags: ["Pitoco's Car"], summary: 'Atualizar evento parcialmente', security: bearer, parameters: idParams(), requestBody: { content: multipart(carEventBody) }, responses: { 200: { description: 'Atualizado' }, 404: r404 } },
  delete: { tags: ["Pitoco's Car"], summary: 'Remover evento', security: bearer, parameters: idParams(), responses: { 200: { description: 'Removido' }, 404: r404 } }
}
const regEventParam = { name: 'eventId', in: 'path', required: true, schema: { type: 'integer' } }
const regBody = { ownerName: { type: 'string' }, ownerEmail: { type: 'string', format: 'email' }, vehicleName: { type: 'string' }, vehicleYear: { type: 'integer' }, vehicleDescription: { type: 'string' }, image: img }
paths['/pitocos-car/events/{eventId}/registrations'] = {
  get: { tags: ["Pitoco's Car"], summary: 'Listar inscrições do evento [AUTH]', security: bearer, parameters: [regEventParam, { name: 'status', in: 'query', schema: { type: 'string', enum: ['Pendente', 'Aprovado', 'Rejeitado'] } }, ...pageParams], responses: { 200: { description: 'OK', content: json(listEnvelope('VehicleRegistration')) }, 401: r401 } },
  post: { tags: ["Pitoco's Car"], summary: 'Submeter inscrição (público) — 422 se o evento atingiu o limite', parameters: [regEventParam], requestBody: { required: true, content: multipart(regBody, ['ownerName', 'ownerEmail', 'vehicleName', 'vehicleYear', 'vehicleDescription']) }, responses: { 201: { description: 'Criado', content: json(dataEnvelope('VehicleRegistration')) }, 422: r422, 404: r404 } }
}
paths['/pitocos-car/events/{eventId}/registrations/{id}'] = {
  get: { tags: ["Pitoco's Car"], summary: 'Inscrição por ID [AUTH]', security: bearer, parameters: [regEventParam, ...idParams()], responses: { 200: { description: 'OK', content: json(dataEnvelope('VehicleRegistration')) }, 404: r404 } },
  put: { tags: ["Pitoco's Car"], summary: 'Atualizar inscrição [AUTH]', security: bearer, parameters: [regEventParam, ...idParams()], requestBody: { content: multipart(regBody) }, responses: { 200: { description: 'Atualizado' }, 404: r404 } },
  delete: { tags: ["Pitoco's Car"], summary: 'Remover inscrição [AUTH]', security: bearer, parameters: [regEventParam, ...idParams()], responses: { 200: { description: 'Removido' }, 404: r404 } }
}
paths['/pitocos-car/events/{eventId}/registrations/{id}/status'] = {
  patch: { tags: ["Pitoco's Car"], summary: 'Atualizar somente o status [AUTH]', security: bearer, parameters: [regEventParam, ...idParams()], requestBody: { required: true, content: json({ type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['Pendente', 'Aprovado', 'Rejeitado'] } } }) }, responses: { 200: { description: 'Atualizado' }, 422: r422, 404: r404 } }
}

// ── Projeto 3 — Lumière (/lumiere) — escritas [AUTH] ──
addCrud('/lumiere/categories', { tag: 'Lumière', schema: 'ClothingCategory', createProps: { name: { type: 'string' }, description: { type: 'string' }, image: img }, createRequired: ['name'] })
addCrud('/lumiere/products', {
  tag: 'Lumière', schema: 'ClothingProduct',
  listParams: [{ name: 'categoryId', in: 'query', schema: { type: 'integer' } }, { name: 'search', in: 'query', schema: { type: 'string' } }],
  createProps: { name: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, categoryId: { type: 'integer' }, image: img }, createRequired: ['name', 'price', 'categoryId']
})
addCrud('/lumiere/sizes', { tag: 'Lumière', schema: 'ClothingSize', createProps: { label: { type: 'string' }, image: img }, createRequired: ['label'] })
addCrud('/lumiere/stock', {
  tag: 'Lumière', schema: 'ClothingStock', publicRead: false,
  listParams: [{ name: 'productId', in: 'query', schema: { type: 'integer' } }, { name: 'sizeId', in: 'query', schema: { type: 'integer' } }],
  createProps: { productId: { type: 'integer' }, sizeId: { type: 'integer' }, quantity: { type: 'integer' }, image: img }, createRequired: ['productId', 'sizeId']
})
paths['/lumiere/purchases'] = {
  get: { tags: ['Lumière'], summary: 'Listar compras [AUTH]', security: bearer, parameters: pageParams, responses: { 200: { description: 'OK', content: json(listEnvelope('Purchase')) }, 401: r401 } },
  post: { tags: ['Lumière'], summary: 'Criar compra (público, JSON) — baixa estoque em transação', requestBody: { required: true, content: json({ type: 'object', required: ['customerName', 'customerEmail', 'items'], properties: { customerName: { type: 'string' }, customerEmail: { type: 'string', format: 'email' }, items: { type: 'array', items: { type: 'object', required: ['productId', 'sizeId', 'quantity'], properties: { productId: { type: 'integer' }, sizeId: { type: 'integer' }, quantity: { type: 'integer' } } } } } }) }, responses: { 201: { description: 'Criado', content: json(dataEnvelope('Purchase')) }, 422: r422 } }
}
paths['/lumiere/purchases/{id}'] = {
  get: { tags: ['Lumière'], summary: 'Compra por ID (com items) [AUTH]', security: bearer, parameters: idParams(), responses: { 200: { description: 'OK', content: json(dataEnvelope('Purchase')) }, 404: r404 } },
  put: { tags: ['Lumière'], summary: 'Atualizar compra [AUTH]', security: bearer, parameters: idParams(), requestBody: { content: json({ type: 'object', properties: { customerName: { type: 'string' }, customerEmail: { type: 'string' }, status: { type: 'string', enum: ['Pendente', 'Pago', 'Cancelado'] } } }) }, responses: { 200: { description: 'Atualizado' }, 404: r404 } },
  delete: { tags: ['Lumière'], summary: 'Remover compra [AUTH]', security: bearer, parameters: idParams(), responses: { 200: { description: 'Removido' }, 404: r404 } }
}
paths['/lumiere/purchases/{id}/status'] = {
  patch: { tags: ['Lumière'], summary: 'Atualizar status da compra [AUTH]', security: bearer, parameters: idParams(), requestBody: { required: true, content: json({ type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['Pendente', 'Pago', 'Cancelado'] } } }) }, responses: { 200: { description: 'Atualizado' }, 422: r422, 404: r404 } }
}

// ── Projeto 4 — Nexus (/nexus) — catálogo [AUTH ADMIN] ──
addCrud('/nexus/categories', { tag: 'Nexus', schema: 'ElectronicCategory', guard: bearer, createProps: { name: { type: 'string' }, description: { type: 'string' }, image: img }, createRequired: ['name'] })
addCrud('/nexus/products', {
  tag: 'Nexus', schema: 'ElectronicProduct', guard: bearer,
  listParams: [{ name: 'categoryId', in: 'query', schema: { type: 'integer' } }, { name: 'brand', in: 'query', schema: { type: 'string' } }, { name: 'search', in: 'query', schema: { type: 'string' } }, { name: 'lowStock', in: 'query', schema: { type: 'boolean' } }],
  createProps: { name: { type: 'string' }, categoryId: { type: 'integer' }, brand: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, stockQuantity: { type: 'integer' }, lowStockThreshold: { type: 'integer' }, sku: { type: 'string' }, image: img },
  createRequired: ['name', 'categoryId', 'brand', 'description', 'price', 'sku']
})
paths['/nexus/customers/register'] = { post: { tags: ['Nexus'], summary: 'Cadastrar cliente (público)', requestBody: { required: true, content: multipart({ name: { type: 'string' }, email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' }, phone: { type: 'string' }, address: { type: 'string' }, image: img }, ['name', 'email', 'password']) }, responses: { 201: { description: 'Criado', content: json(dataEnvelope('Customer')) }, 422: r422 } } }
paths['/nexus/customers/login'] = { post: { tags: ['Nexus'], summary: 'Login do cliente — retorna JWT', requestBody: { required: true, content: json({ type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' } } }) }, responses: { 200: { description: 'OK', content: json({ type: 'object', properties: { data: { type: 'object', properties: { token: { type: 'string' }, customer: ref('Customer') } }, message: { type: 'string' } } }) }, 401: r401 } } }
paths['/nexus/customers/me'] = {
  get: { tags: ['Nexus'], summary: 'Perfil do cliente autenticado [AUTH]', security: bearer, responses: { 200: { description: 'OK', content: json(dataEnvelope('Customer')) }, 401: r401 } },
  put: { tags: ['Nexus'], summary: 'Atualizar perfil [AUTH]', security: bearer, requestBody: { content: multipart({ name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, phone: { type: 'string' }, address: { type: 'string' }, image: img }) }, responses: { 200: { description: 'Atualizado' }, 401: r401 } },
  patch: { tags: ['Nexus'], summary: 'Atualizar perfil parcialmente [AUTH]', security: bearer, requestBody: { content: multipart({ name: { type: 'string' }, phone: { type: 'string' }, address: { type: 'string' }, image: img }) }, responses: { 200: { description: 'Atualizado' }, 401: r401 } },
  delete: { tags: ['Nexus'], summary: 'Remover a própria conta [AUTH]', security: bearer, responses: { 200: { description: 'Removido' }, 401: r401 } }
}
paths['/nexus/customers'] = { get: { tags: ['Nexus'], summary: 'Listar clientes [AUTH ADMIN]', security: bearer, parameters: pageParams, responses: { 200: { description: 'OK', content: json(listEnvelope('Customer')) }, 403: r403 } } }
paths['/nexus/customers/{id}'] = { get: { tags: ['Nexus'], summary: 'Cliente por ID [AUTH ADMIN]', security: bearer, parameters: idParams(), responses: { 200: { description: 'OK', content: json(dataEnvelope('Customer')) }, 403: r403, 404: r404 } } }
paths['/nexus/cart'] = {
  get: { tags: ['Nexus'], summary: 'Carrinho do cliente [AUTH]', security: bearer, responses: { 200: { description: 'OK', content: json({ type: 'object', properties: { data: { type: 'array', items: ref('CartItem') }, meta: { type: 'object', properties: { itemsCount: { type: 'integer' }, total: { type: 'number' } } }, message: { type: 'string' } } }) }, 401: r401 } },
  post: { tags: ['Nexus'], summary: 'Adicionar item ao carrinho [AUTH]', security: bearer, requestBody: { required: true, content: json({ type: 'object', required: ['productId'], properties: { productId: { type: 'integer' }, quantity: { type: 'integer', default: 1 } } }) }, responses: { 201: { description: 'Adicionado', content: json(dataEnvelope('CartItem')) }, 404: r404 } },
  delete: { tags: ['Nexus'], summary: 'Esvaziar carrinho [AUTH]', security: bearer, responses: { 200: { description: 'Esvaziado' }, 401: r401 } }
}
paths['/nexus/cart/{productId}'] = {
  patch: { tags: ['Nexus'], summary: 'Atualizar quantidade [AUTH]', security: bearer, parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: json({ type: 'object', required: ['quantity'], properties: { quantity: { type: 'integer' } } }) }, responses: { 200: { description: 'Atualizado' }, 404: r404 } },
  delete: { tags: ['Nexus'], summary: 'Remover item [AUTH]', security: bearer, parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Removido' }, 404: r404 } }
}
paths['/nexus/orders'] = {
  get: { tags: ['Nexus'], summary: 'Pedidos do cliente [AUTH]', security: bearer, parameters: pageParams, responses: { 200: { description: 'OK', content: json(listEnvelope('Order')) }, 401: r401 } },
  post: { tags: ['Nexus'], summary: 'Criar pedido a partir do carrinho [AUTH]', security: bearer, responses: { 201: { description: 'Criado', content: json(dataEnvelope('Order')) }, 422: { description: 'Carrinho vazio ou estoque insuficiente' }, 401: r401 } }
}
paths['/nexus/orders/{id}'] = {
  get: { tags: ['Nexus'], summary: 'Pedido por ID (com items) [AUTH]', security: bearer, parameters: idParams(), responses: { 200: { description: 'OK', content: json(dataEnvelope('Order')) }, 403: r403, 404: r404 } },
  delete: { tags: ['Nexus'], summary: 'Cancelar pedido (apenas status Pendente) [AUTH]', security: bearer, parameters: idParams(), responses: { 200: { description: 'Cancelado' }, 422: { description: 'Apenas pedidos pendentes podem ser cancelados' }, 404: r404 } }
}
paths['/nexus/orders/{id}/status'] = { patch: { tags: ['Nexus'], summary: 'Atualizar status do pedido [AUTH ADMIN]', security: bearer, parameters: idParams(), requestBody: { required: true, content: json({ type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['Pendente', 'Pago', 'Enviado', 'Entregue', 'Cancelado'] } } }) }, responses: { 200: { description: 'Atualizado' }, 403: r403, 422: r422, 404: r404 } } }
paths['/nexus/admin/orders'] = { get: { tags: ['Nexus'], summary: 'Todos os pedidos [AUTH ADMIN]', security: bearer, parameters: [{ name: 'status', in: 'query', schema: { type: 'string' } }, ...pageParams], responses: { 200: { description: 'OK', content: json(listEnvelope('Order')) }, 403: r403 } } }
paths['/nexus/admin/products/low-stock'] = { get: { tags: ['Nexus'], summary: 'Produtos com estoque baixo [AUTH ADMIN]', security: bearer, responses: { 200: { description: 'OK', content: json(listEnvelope('ElectronicProduct')) }, 403: r403 } } }

// ── Projeto 5 — Maxblock (/maxblock) — escritas [AUTH] ──
addCrud('/maxblock/categories', { tag: 'Maxblock', schema: 'GameCategory', createProps: { name: { type: 'string' }, image: img }, createRequired: ['name'] })
addCrud('/maxblock/games', {
  tag: 'Maxblock', schema: 'Game',
  listParams: [{ name: 'categoryId', in: 'query', schema: { type: 'integer' } }, { name: 'ageRating', in: 'query', schema: { type: 'string' } }, { name: 'search', in: 'query', schema: { type: 'string' } }, { name: 'sort', in: 'query', schema: { type: 'string', enum: ['likes'] } }],
  createProps: { name: { type: 'string' }, description: { type: 'string' }, categoryId: { type: 'integer' }, ageRating: { type: 'string', enum: ['Livre', '10+', '12+', '14+', '16+', '18+'] }, controls: { type: 'string' }, gameUrl: { type: 'string', format: 'uri' }, image: img },
  createRequired: ['name', 'description', 'categoryId', 'ageRating', 'controls', 'gameUrl']
})
const likesResp = json({ type: 'object', properties: { data: { type: 'object', properties: { gameId: { type: 'integer' }, likesCount: { type: 'integer' } } }, message: { type: 'string' } } })
paths['/maxblock/games/{id}/like'] = {
  post: { tags: ['Maxblock'], summary: 'Curtir (público, dedup por IP)', parameters: idParams(), responses: { 201: { description: 'Curtido', content: likesResp }, 409: { description: 'Já curtiu este jogo' }, 404: r404 } },
  delete: { tags: ['Maxblock'], summary: 'Descurtir (público)', parameters: idParams(), responses: { 200: { description: 'Descurtido', content: likesResp }, 404: r404 } }
}
paths['/maxblock/games/{id}/likes/count'] = { get: { tags: ['Maxblock'], summary: 'Total de curtidas (público)', parameters: idParams(), responses: { 200: { description: 'OK', content: json({ type: 'object', properties: { data: { type: 'object', properties: { gameId: { type: 'integer' }, likesCount: { type: 'integer' }, total: { type: 'integer' } } }, message: { type: 'string' } } }) }, 404: r404 } } }

// ── Projeto 6 — Swell Point (/swell-point) — escritas [AUTH] ──
const searchParam = [{ name: 'search', in: 'query', schema: { type: 'string' }, description: 'Busca em name e description' }]
addCrud('/swell-point/beaches', { tag: 'Swell Point', schema: 'Beach', listParams: searchParam, createProps: { name: { type: 'string' }, description: { type: 'string' }, image: img }, createRequired: ['name', 'description'] })
addCrud('/swell-point/events', { tag: 'Swell Point', schema: 'SurfEvent', listParams: searchParam, createProps: { name: { type: 'string' }, description: { type: 'string' }, image: img }, createRequired: ['name', 'description'] })

module.exports = { tags, schemas, paths }
