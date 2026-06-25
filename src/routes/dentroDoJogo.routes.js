const { Router } = require('express')
const crudRouter = require('../utils/crudRouter')
const { authenticate } = require('../middlewares/auth')

const groups = require('../controllers/groups.controller')
const teams = require('../controllers/teams.controller')
const matches = require('../controllers/matches.controller')
const news = require('../controllers/news.controller')

// PROJETO 1 — Dentro do Jogo (Portal Copa do Mundo FIFA 2026)
// Escritas exigem autenticação ([AUTH]); leituras são públicas.
const router = Router()

router.use('/groups', crudRouter(groups, { guard: authenticate }))
router.use('/teams', crudRouter(teams, { guard: authenticate }))
router.use('/matches', crudRouter(matches, { guard: authenticate }))
router.use('/news', crudRouter(news, { guard: authenticate }))

module.exports = router
