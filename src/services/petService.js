const prisma = require('../config/database')

async function listPets(filters) {
  const where = {}

  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' }
  }

  if (filters.species) {
    where.species = { equals: filters.species, mode: 'insensitive' }
  }

  if (filters.size) {
    where.size = { equals: filters.size, mode: 'insensitive' }
  }

  const pets = await prisma.pet.findMany({
    where,
    orderBy: { created_at: 'desc' }
  })

  return pets
}

async function getPetById(id) {
  const pet = await prisma.pet.findUnique({
    where: { id: parseInt(id) }
  })

  if (!pet) {
    const error = new Error('Pet não encontrado')
    error.status = 404
    throw error
  }

  return pet
}

async function createPet(data, userId) {
  const requiredFields = ['name', 'species', 'age', 'size']
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === '') {
      const error = new Error(`Campo obrigatório ausente: ${field}`)
      error.status = 400
      throw error
    }
  }

  if (data.name.length < 3) {
    const error = new Error('Nome deve ter pelo menos 3 caracteres')
    error.status = 400
    throw error
  }

  const age = parseInt(data.age)
  if (isNaN(age) || age < 0) {
    const error = new Error('Idade deve ser um valor positivo')
    error.status = 400
    throw error
  }

  const pet = await prisma.pet.create({
    data: {
      name: data.name,
      species: data.species,
      age,
      size: data.size,
      description: data.description || null,
      status: data.status || 'disponivel',
      created_by: userId
    }
  })

  return pet
}

async function updatePet(id, data) {
  const petId = parseInt(id)

  const existing = await prisma.pet.findUnique({ where: { id: petId } })
  if (!existing) {
    const error = new Error('Pet não encontrado')
    error.status = 404
    throw error
  }

  const updateData = {}

  if (data.name !== undefined) {
    if (data.name.length < 3) {
      const error = new Error('Nome deve ter pelo menos 3 caracteres')
      error.status = 400
      throw error
    }
    updateData.name = data.name
  }

  if (data.species !== undefined) updateData.species = data.species
  if (data.size !== undefined) updateData.size = data.size
  if (data.description !== undefined) updateData.description = data.description
  if (data.status !== undefined) updateData.status = data.status

  if (data.age !== undefined) {
    const age = parseInt(data.age)
    if (isNaN(age) || age < 0) {
      const error = new Error('Idade deve ser um valor positivo')
      error.status = 400
      throw error
    }
    updateData.age = age
  }

  const pet = await prisma.pet.update({
    where: { id: petId },
    data: updateData
  })

  return pet
}

async function deletePet(id) {
  const petId = parseInt(id)

  const existing = await prisma.pet.findUnique({ where: { id: petId } })
  if (!existing) {
    const error = new Error('Pet não encontrado')
    error.status = 404
    throw error
  }

  await prisma.pet.delete({ where: { id: petId } })
}

module.exports = { listPets, getPetById, createPet, updatePet, deletePet }
