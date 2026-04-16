const petService = require('../services/petService')

async function list(req, res, next) {
  try {
    const filters = {
      name: req.query.name,
      species: req.query.species,
      size: req.query.size
    }

    const pets = await petService.listPets(filters)
    return res.json(pets)
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const pet = await petService.getPetById(req.params.id)
    return res.json(pet)
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const pet = await petService.createPet(req.body, req.user.id)
    return res.status(201).json(pet)
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const pet = await petService.updatePet(req.params.id, req.body)
    return res.json(pet)
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    await petService.deletePet(req.params.id)
    return res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getById, create, update, remove }
