const jwt = require('jsonwebtoken')

// Middleware JWT compartilhado pelos projetos novos (spec).
// `authenticate` exige um Bearer token válido; `authorizeAdmin` exige role admin.

function authenticate (req, res, next) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token inválido ou ausente' })
  }

  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou ausente' })
  }
}

// Deve ser usado sempre após `authenticate` (ex: router.use(authenticate, authorizeAdmin)).
function authorizeAdmin (req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores' })
  }
  next()
}

module.exports = { authenticate, authorizeAdmin }
