const prisma = require('../config/database')

async function listPlans(filters) {
  const where = {}

  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' }
  }

  if (filters.type) {
    where.type = { equals: filters.type, mode: 'insensitive' }
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    where.price = {}
    if (filters.priceMin !== undefined) {
      where.price.gte = parseFloat(filters.priceMin)
    }
    if (filters.priceMax !== undefined) {
      where.price.lte = parseFloat(filters.priceMax)
    }
  }

  const plans = await prisma.plan.findMany({
    where,
    orderBy: { price: 'asc' }
  })

  return plans
}

async function getPlanById(id) {
  const plan = await prisma.plan.findUnique({
    where: { id: parseInt(id) }
  })

  if (!plan) {
    const error = new Error('Plano não encontrado')
    error.status = 404
    throw error
  }

  return plan
}

async function createPlan(data, userId) {
  const requiredFields = ['name', 'type', 'price', 'weekly_frequency', 'description']
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === '') {
      const error = new Error(`Campo obrigatório ausente: ${field}`)
      error.status = 400
      throw error
    }
  }

  const price = parseFloat(data.price)
  if (isNaN(price) || price < 0.01) {
    const error = new Error('Preço deve ser pelo menos R$ 0,01')
    error.status = 400
    throw error
  }

  const weeklyFrequency = parseInt(data.weekly_frequency)
  if (isNaN(weeklyFrequency) || weeklyFrequency < 1 || weeklyFrequency > 7) {
    const error = new Error('Frequência semanal deve ser entre 1 e 7')
    error.status = 400
    throw error
  }

  if (data.description.length < 20) {
    const error = new Error('Descrição deve ter pelo menos 20 caracteres')
    error.status = 400
    throw error
  }

  const plan = await prisma.plan.create({
    data: {
      name: data.name,
      type: data.type,
      price,
      weekly_frequency: weeklyFrequency,
      description: data.description,
      created_by: userId
    }
  })

  return plan
}

async function updatePlan(id, data) {
  const planId = parseInt(id)

  const existing = await prisma.plan.findUnique({ where: { id: planId } })
  if (!existing) {
    const error = new Error('Plano não encontrado')
    error.status = 404
    throw error
  }

  const updateData = {}

  if (data.name !== undefined) updateData.name = data.name
  if (data.type !== undefined) updateData.type = data.type

  if (data.price !== undefined) {
    const price = parseFloat(data.price)
    if (isNaN(price) || price < 0.01) {
      const error = new Error('Preço deve ser pelo menos R$ 0,01')
      error.status = 400
      throw error
    }
    updateData.price = price
  }

  if (data.weekly_frequency !== undefined) {
    const weeklyFrequency = parseInt(data.weekly_frequency)
    if (isNaN(weeklyFrequency) || weeklyFrequency < 1 || weeklyFrequency > 7) {
      const error = new Error('Frequência semanal deve ser entre 1 e 7')
      error.status = 400
      throw error
    }
    updateData.weekly_frequency = weeklyFrequency
  }

  if (data.description !== undefined) {
    if (data.description.length < 20) {
      const error = new Error('Descrição deve ter pelo menos 20 caracteres')
      error.status = 400
      throw error
    }
    updateData.description = data.description
  }

  const plan = await prisma.plan.update({
    where: { id: planId },
    data: updateData
  })

  return plan
}

async function deletePlan(id) {
  const planId = parseInt(id)

  const existing = await prisma.plan.findUnique({ where: { id: planId } })
  if (!existing) {
    const error = new Error('Plano não encontrado')
    error.status = 404
    throw error
  }

  await prisma.plan.delete({ where: { id: planId } })
}

module.exports = { listPlans, getPlanById, createPlan, updatePlan, deletePlan }
