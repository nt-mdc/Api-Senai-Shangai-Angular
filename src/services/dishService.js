const prisma = require('../config/database')

async function listDishes(filters) {
  const where = {}

  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' }
  }

  if (filters.category) {
    where.category = { equals: filters.category, mode: 'insensitive' }
  }

  const dishes = await prisma.dish.findMany({
    where,
    orderBy: [{ category: 'asc' }, { name: 'asc' }]
  })

  return dishes
}

async function getDishById(id) {
  const dish = await prisma.dish.findUnique({
    where: { id: parseInt(id) }
  })

  if (!dish) {
    const error = new Error('Prato não encontrado')
    error.status = 404
    throw error
  }

  return dish
}

async function createDish(data, userId) {
  const requiredFields = ['name', 'category', 'price']
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

  const dish = await prisma.dish.create({
    data: {
      name: data.name,
      category: data.category,
      price,
      description: data.description || null,
      available: data.available !== undefined ? (data.available === 'true' || data.available === true) : true,
      created_by: userId
    }
  })

  return dish
}

async function updateDish(id, data) {
  const dishId = parseInt(id)

  const existing = await prisma.dish.findUnique({ where: { id: dishId } })
  if (!existing) {
    const error = new Error('Prato não encontrado')
    error.status = 404
    throw error
  }

  const updateData = {}

  if (data.name !== undefined) updateData.name = data.name
  if (data.category !== undefined) updateData.category = data.category
  if (data.description !== undefined) updateData.description = data.description

  if (data.available !== undefined) {
    updateData.available = data.available === 'true' || data.available === true
  }

  if (data.price !== undefined) {
    const price = parseFloat(data.price)
    if (isNaN(price) || price < 0.01) {
      const error = new Error('Preço deve ser pelo menos R$ 0,01')
      error.status = 400
      throw error
    }
    updateData.price = price
  }

  const dish = await prisma.dish.update({
    where: { id: dishId },
    data: updateData
  })

  return dish
}

async function toggleAvailability(id) {
  const dishId = parseInt(id)

  const existing = await prisma.dish.findUnique({ where: { id: dishId } })
  if (!existing) {
    const error = new Error('Prato não encontrado')
    error.status = 404
    throw error
  }

  const dish = await prisma.dish.update({
    where: { id: dishId },
    data: { available: !existing.available }
  })

  return dish
}

async function deleteDish(id) {
  const dishId = parseInt(id)

  const existing = await prisma.dish.findUnique({ where: { id: dishId } })
  if (!existing) {
    const error = new Error('Prato não encontrado')
    error.status = 404
    throw error
  }

  await prisma.dish.delete({ where: { id: dishId } })
}

module.exports = { listDishes, getDishById, createDish, updateDish, toggleAvailability, deleteDish }
