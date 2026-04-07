const authService = require('../services/authService')

async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' })
    }

    const result = await authService.login(email, password)
    return res.json(result)
  } catch (err) {
    next(err)
  }
}

async function createAdmin(req, res, next) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' })
    }

    const result = await authService.createAdmin(name, email, password)
    return res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = { login, createAdmin }
