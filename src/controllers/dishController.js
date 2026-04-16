const dishService = require('../services/dishService')

async function list(req, res, next) {
  try {
    const filters = {
      name: req.query.name,
      category: req.query.category
    }

    const dishes = await dishService.listDishes(filters)
    return res.json(dishes)
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const dish = await dishService.getDishById(req.params.id)
    return res.json(dish)
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const dish = await dishService.createDish(req.body, req.user.id)
    return res.status(201).json(dish)
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const dish = await dishService.updateDish(req.params.id, req.body)
    return res.json(dish)
  } catch (err) {
    next(err)
  }
}

async function toggleAvailability(req, res, next) {
  try {
    const dish = await dishService.toggleAvailability(req.params.id)
    return res.json(dish)
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    await dishService.deleteDish(req.params.id)
    return res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getById, create, update, toggleAvailability, remove }
