const modalityService = require('../services/modalityService')

async function list(req, res, next) {
  try {
    const filters = {
      name: req.query.name,
      level: req.query.level,
      status: req.query.status
    }

    const modalities = await modalityService.listModalities(filters)
    return res.json(modalities)
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const modality = await modalityService.getModalityById(req.params.id)
    return res.json(modality)
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const modality = await modalityService.createModality(req.body, req.user.id)
    return res.status(201).json(modality)
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const modality = await modalityService.updateModality(req.params.id, req.body)
    return res.json(modality)
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    await modalityService.deleteModality(req.params.id)
    return res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getById, create, update, remove }
