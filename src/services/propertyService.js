const prisma = require('../config/database')

async function listProperties(filters) {
  const where = {}

  if (filters.address) {
    where.address = { contains: filters.address, mode: 'insensitive' }
  }

  if (filters.type) {
    where.type = { equals: filters.type, mode: 'insensitive' }
  }

  if (filters.modality) {
    where.modality = { equals: filters.modality, mode: 'insensitive' }
  }

  const properties = await prisma.property.findMany({
    where,
    orderBy: { created_at: 'desc' }
  })

  return properties
}

async function getPropertyById(id) {
  const property = await prisma.property.findUnique({
    where: { id: parseInt(id) }
  })

  if (!property) {
    const error = new Error('Imóvel não encontrado')
    error.status = 404
    throw error
  }

  return property
}

async function createProperty(data, userId) {
  const requiredFields = ['type', 'address', 'area', 'price', 'modality']
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === '') {
      const error = new Error(`Campo obrigatório ausente: ${field}`)
      error.status = 400
      throw error
    }
  }

  const area = parseFloat(data.area)
  if (isNaN(area) || area < 1) {
    const error = new Error('Metragem deve ser pelo menos 1 m²')
    error.status = 400
    throw error
  }

  const price = parseFloat(data.price)
  if (isNaN(price) || price < 0) {
    const error = new Error('Preço deve ser um valor positivo')
    error.status = 400
    throw error
  }

  const property = await prisma.property.create({
    data: {
      type: data.type,
      address: data.address,
      area,
      price,
      modality: data.modality,
      description: data.description || null,
      status: data.status || 'disponivel',
      created_by: userId
    }
  })

  return property
}

async function updateProperty(id, data) {
  const propertyId = parseInt(id)

  const existing = await prisma.property.findUnique({ where: { id: propertyId } })
  if (!existing) {
    const error = new Error('Imóvel não encontrado')
    error.status = 404
    throw error
  }

  const updateData = {}

  if (data.type !== undefined) updateData.type = data.type
  if (data.address !== undefined) updateData.address = data.address
  if (data.modality !== undefined) updateData.modality = data.modality
  if (data.description !== undefined) updateData.description = data.description
  if (data.status !== undefined) updateData.status = data.status

  if (data.area !== undefined) {
    const area = parseFloat(data.area)
    if (isNaN(area) || area < 1) {
      const error = new Error('Metragem deve ser pelo menos 1 m²')
      error.status = 400
      throw error
    }
    updateData.area = area
  }

  if (data.price !== undefined) {
    const price = parseFloat(data.price)
    if (isNaN(price) || price < 0) {
      const error = new Error('Preço deve ser um valor positivo')
      error.status = 400
      throw error
    }
    updateData.price = price
  }

  const property = await prisma.property.update({
    where: { id: propertyId },
    data: updateData
  })

  return property
}

async function deleteProperty(id) {
  const propertyId = parseInt(id)

  const existing = await prisma.property.findUnique({ where: { id: propertyId } })
  if (!existing) {
    const error = new Error('Imóvel não encontrado')
    error.status = 404
    throw error
  }

  await prisma.property.delete({ where: { id: propertyId } })
}

module.exports = { listProperties, getPropertyById, createProperty, updateProperty, deleteProperty }
