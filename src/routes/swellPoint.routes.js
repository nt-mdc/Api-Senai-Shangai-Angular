const { Router } = require('express')
const crudRouter = require('../utils/crudRouter')
const { authenticate } = require('../middlewares/auth')

const beaches = require('../controllers/beaches.controller')
const surfEvents = require('../controllers/surfEvents.controller')

// PROJETO 6 — Swell Point (praias e eventos de surf)
const router = Router()

router.use('/beaches', crudRouter(beaches, { guard: authenticate }))
router.use('/events', crudRouter(surfEvents, { guard: authenticate }))

module.exports = router
