const authGuard = require('./authGuard')

function adminGuard(req, res, next) {
  authGuard(req, res, (err) => {
    if (err) return next(err)

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso restrito a administradores' })
    }

    next()
  })
}

module.exports = adminGuard
