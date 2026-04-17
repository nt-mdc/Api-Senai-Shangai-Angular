const prisma = require('../config/database')

async function listModalities(filters) {
  const where = {}

  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' }
  }

  if (filters.level) {
    where.level = { equals: filters.level, mode: 'insensitive' }
  }

  if (filters.status) {
    where.status = { equals: filters.status, mode: 'insensitive' }
  }

  const modalities = await prisma.modality.findMany({
    where,
    orderBy: { name: 'asc' }
  })

  return modalities
}

async function getModalityById(id) {
  const modality = await prisma.modality.findUnique({
    where: { id: parseInt(id) }
  })

  if (!modality) {
    const error = new Error('Modalidade não encontrada')
    error.status = 404
    throw error
  }

  return modality
}

async function createModality(data, userId) {
  const requiredFields = ['name', 'description', 'level']
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === '') {
      const error = new Error(`Campo obrigatório ausente: ${field}`)
      error.status = 400
      throw error
    }
  }

  if (data.description.length < 20) {
    const error = new Error('Descrição deve ter pelo menos 20 caracteres')
    error.status = 400
    throw error
  }

  const modality = await prisma.modality.create({
    data: {
      name: data.name,
      description: data.description,
      level: data.level,
      status: data.status || 'ativa',
      created_by: userId
    }
  })

  return modality
}

async function updateModality(id, data) {
  const modalityId = parseInt(id)

  const existing = await prisma.modality.findUnique({ where: { id: modalityId } })
  if (!existing) {
    const error = new Error('Modalidade não encontrada')
    error.status = 404
    throw error
  }

  const updateData = {}

  if (data.name !== undefined) updateData.name = data.name
  if (data.level !== undefined) updateData.level = data.level
  if (data.status !== undefined) updateData.status = data.status

  if (data.description !== undefined) {
    if (data.description.length < 20) {
      const error = new Error('Descrição deve ter pelo menos 20 caracteres')
      error.status = 400
      throw error
    }
    updateData.description = data.description
  }

  const modality = await prisma.modality.update({
    where: { id: modalityId },
    data: updateData
  })

  return modality
}

async function deleteModality(id) {
  const modalityId = parseInt(id)

  const existing = await prisma.modality.findUnique({ where: { id: modalityId } })
  if (!existing) {
    const error = new Error('Modalidade não encontrada')
    error.status = 404
    throw error
  }

  await prisma.modality.delete({ where: { id: modalityId } })
}

module.exports = { listModalities, getModalityById, createModality, updateModality, deleteModality }
