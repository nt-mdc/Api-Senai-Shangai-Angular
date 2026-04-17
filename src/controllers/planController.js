const planService = require('../services/planService')

async function list(req, res, next) {
  try {
    const filters = {
      name: req.query.name,
      type: req.query.type,
      priceMin: req.query.priceMin,
      priceMax: req.query.priceMax
    }

    const plans = await planService.listPlans(filters)
    return res.json(plans)
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const plan = await planService.getPlanById(req.params.id)
    return res.json(plan)
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const plan = await planService.createPlan(req.body, req.user.id)
    return res.status(201).json(plan)
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const plan = await planService.updatePlan(req.params.id, req.body)
    return res.json(plan)
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    await planService.deletePlan(req.params.id)
    return res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getById, create, update, remove }
