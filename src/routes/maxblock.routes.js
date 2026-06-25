const { Router } = require('express')
const upload = require('../middlewares/upload')
const crudRouter = require('../utils/crudRouter')
const { authenticate } = require('../middlewares/auth')

const categories = require('../controllers/gameCategories.controller')
const games = require('../controllers/games.controller')

// PROJETO 5 — Maxblock (catálogo de jogos)
const router = Router()

router.use('/categories', crudRouter(categories, { guard: authenticate }))

const gamesRouter = Router()
gamesRouter.get('/', games.list)
gamesRouter.get('/:id', games.getById)
gamesRouter.post('/', authenticate, upload.single('image'), games.create)
gamesRouter.put('/:id', authenticate, upload.single('image'), games.update)
gamesRouter.patch('/:id', authenticate, upload.single('image'), games.update)
gamesRouter.delete('/:id', authenticate, games.remove)

// Curtidas por IP (públicas).
gamesRouter.post('/:id/like', games.like)
gamesRouter.delete('/:id/like', games.unlike)
gamesRouter.get('/:id/likes/count', games.likesCount)

router.use('/games', gamesRouter)

module.exports = router
