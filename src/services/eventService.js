const prisma = require('../config/database')

async function listEvents(filters) {
  const where = {}

  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' }
  }

  if (filters.category) {
    where.category = { equals: filters.category, mode: 'insensitive' }
  }

  if (filters.date) {
    const targetDate = new Date(filters.date)
    if (!isNaN(targetDate.getTime())) {
      const startOfDay = new Date(targetDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(targetDate)
      endOfDay.setHours(23, 59, 59, 999)
      where.date_time = { gte: startOfDay, lte: endOfDay }
    }
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { date_time: 'asc' }
  })

  return events
}

async function getEventById(id) {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(id) }
  })

  if (!event) {
    const error = new Error('Evento não encontrado')
    error.status = 404
    throw error
  }

  return event
}

async function createEvent(data, userId) {
  const requiredFields = ['name', 'category', 'date_time', 'location', 'max_capacity']
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === '') {
      const error = new Error(`Campo obrigatório ausente: ${field}`)
      error.status = 400
      throw error
    }
  }

  const dateTime = new Date(data.date_time)
  if (isNaN(dateTime.getTime())) {
    const error = new Error('Data e hora inválidas')
    error.status = 400
    throw error
  }

  if (dateTime <= new Date()) {
    const error = new Error('Não é permitido criar eventos com datas retroativas')
    error.status = 400
    throw error
  }

  const maxCapacity = parseInt(data.max_capacity)
  if (isNaN(maxCapacity) || maxCapacity < 1) {
    const error = new Error('Limite de vagas deve ser pelo menos 1')
    error.status = 400
    throw error
  }

  const event = await prisma.event.create({
    data: {
      name: data.name,
      category: data.category,
      date_time: dateTime,
      location: data.location,
      description: data.description || null,
      max_capacity: maxCapacity,
      registered_count: 0,
      created_by: userId
    }
  })

  return event
}

async function updateEvent(id, data) {
  const eventId = parseInt(id)

  const existing = await prisma.event.findUnique({ where: { id: eventId } })
  if (!existing) {
    const error = new Error('Evento não encontrado')
    error.status = 404
    throw error
  }

  const updateData = {}

  if (data.name !== undefined) updateData.name = data.name
  if (data.category !== undefined) updateData.category = data.category
  if (data.location !== undefined) updateData.location = data.location
  if (data.description !== undefined) updateData.description = data.description

  if (data.date_time !== undefined) {
    const dateTime = new Date(data.date_time)
    if (isNaN(dateTime.getTime())) {
      const error = new Error('Data e hora inválidas')
      error.status = 400
      throw error
    }
    if (dateTime <= new Date()) {
      const error = new Error('Não é permitido definir datas retroativas')
      error.status = 400
      throw error
    }
    updateData.date_time = dateTime
  }

  if (data.max_capacity !== undefined) {
    const maxCapacity = parseInt(data.max_capacity)
    if (isNaN(maxCapacity) || maxCapacity < 1) {
      const error = new Error('Limite de vagas deve ser pelo menos 1')
      error.status = 400
      throw error
    }
    updateData.max_capacity = maxCapacity
  }

  if (data.registered_count !== undefined) {
    const registeredCount = parseInt(data.registered_count)
    if (isNaN(registeredCount) || registeredCount < 0) {
      const error = new Error('Quantidade de inscritos deve ser positiva')
      error.status = 400
      throw error
    }
    updateData.registered_count = registeredCount
  }

  const event = await prisma.event.update({
    where: { id: eventId },
    data: updateData
  })

  return event
}

async function deleteEvent(id) {
  const eventId = parseInt(id)

  const existing = await prisma.event.findUnique({ where: { id: eventId } })
  if (!existing) {
    const error = new Error('Evento não encontrado')
    error.status = 404
    throw error
  }

  await prisma.event.delete({ where: { id: eventId } })
}

module.exports = { listEvents, getEventById, createEvent, updateEvent, deleteEvent }
