const turismService = require('../services/turismService')

async function list(req, res, next) {
  try {
    const filters = {
      name: req.query.name,
      requires_ticket: req.query.requires_ticket,
      category: req.query.category
    }

    const spots = await turismService.listSpots(filters)
    return res.json(spots)
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const spot = await turismService.getSpotById(req.params.id)
    return res.json(spot)
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const spot = await turismService.createSpot(req.body, req.files, req.user.id)
    return res.status(201).json(spot)
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const spot = await turismService.updateSpot(req.params.id, req.body, req.files)
    return res.json(spot)
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    await turismService.deleteSpot(req.params.id)
    return res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getById, create, update, remove }
