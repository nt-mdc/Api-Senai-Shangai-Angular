const { Router } = require('express')
const upload = require('../middlewares/upload')
const crudRouter = require('../utils/crudRouter')
const { authenticate } = require('../middlewares/auth')

const categories = require('../controllers/clothingCategories.controller')
const products = require('../controllers/clothingProducts.controller')
const sizes = require('../controllers/clothingSizes.controller')
const stock = require('../controllers/clothingStock.controller')
const purchases = require('../controllers/purchases.controller')

// PROJETO 3 — Lumière (loja de roupas)
const router = Router()

router.use('/categories', crudRouter(categories, { guard: authenticate }))
router.use('/products', crudRouter(products, { guard: authenticate }))
router.use('/sizes', crudRouter(sizes, { guard: authenticate }))

// Estoque: todas as rotas exigem autenticação (inclusive leitura).
const stockRouter = Router()
stockRouter.get('/', authenticate, stock.list)
stockRouter.get('/:id', authenticate, stock.getById)
stockRouter.post('/', authenticate, upload.single('image'), stock.create)
stockRouter.put('/:id', authenticate, upload.single('image'), stock.update)
stockRouter.patch('/:id', authenticate, upload.single('image'), stock.update)
stockRouter.delete('/:id', authenticate, stock.remove)
router.use('/stock', stockRouter)

// Compras: criação pública (JSON com items[]); demais rotas exigem autenticação.
const purchasesRouter = Router()
purchasesRouter.get('/', authenticate, purchases.list)
purchasesRouter.get('/:id', authenticate, purchases.getById)
purchasesRouter.post('/', purchases.create)
purchasesRouter.put('/:id', authenticate, purchases.update)
purchasesRouter.patch('/:id/status', authenticate, purchases.updateStatus)
purchasesRouter.delete('/:id', authenticate, purchases.remove)
router.use('/purchases', purchasesRouter)

module.exports = router
