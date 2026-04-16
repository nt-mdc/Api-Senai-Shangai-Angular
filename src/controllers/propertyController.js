const propertyService = require('../services/propertyService')

async function list(req, res, next) {
  try {
    const filters = {
      address: req.query.address,
      type: req.query.type,
      modality: req.query.modality
    }

    const properties = await propertyService.listProperties(filters)
    return res.json(properties)
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const property = await propertyService.getPropertyById(req.params.id)
    return res.json(property)
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const property = await propertyService.createProperty(req.body, req.user.id)
    return res.status(201).json(property)
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const property = await propertyService.updateProperty(req.params.id, req.body)
    return res.json(property)
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    await propertyService.deleteProperty(req.params.id)
    return res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getById, create, update, remove }
