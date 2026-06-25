const { Router } = require('express')
const upload = require('../middlewares/upload')
const crudRouter = require('../utils/crudRouter')
const { authenticate, authorizeAdmin } = require('../middlewares/auth')

const categories = require('../controllers/electronicCategories.controller')
const products = require('../controllers/electronicProducts.controller')
const customers = require('../controllers/customers.controller')
const cart = require('../controllers/cart.controller')
const orders = require('../controllers/orders.controller')

// PROJETO 4 — Nexus (loja de eletrônicos)
const router = Router()
const adminGuard = [authenticate, authorizeAdmin]

// Catálogo — leitura pública, escrita só admin.
router.use('/categories', crudRouter(categories, { guard: adminGuard }))
router.use('/products', crudRouter(products, { guard: adminGuard }))

// Clientes — /me antes de /:id para não capturar "me" como id.
const customersRouter = Router()
customersRouter.post('/register', upload.single('image'), customers.register)
customersRouter.post('/login', customers.login)
customersRouter.get('/me', authenticate, customers.me)
customersRouter.put('/me', authenticate, upload.single('image'), customers.updateMe)
customersRouter.patch('/me', authenticate, upload.single('image'), customers.updateMe)
customersRouter.delete('/me', authenticate, customers.deleteMe)
customersRouter.get('/', ...adminGuard, customers.list)
customersRouter.get('/:id', ...adminGuard, customers.getById)
router.use('/customers', customersRouter)

// Carrinho — sempre escopo do cliente autenticado.
const cartRouter = Router()
cartRouter.get('/', authenticate, cart.list)
cartRouter.post('/', authenticate, cart.add)
cartRouter.patch('/:productId', authenticate, cart.updateQuantity)
cartRouter.delete('/:productId', authenticate, cart.remove)
cartRouter.delete('/', authenticate, cart.clear)
router.use('/cart', cartRouter)

// Pedidos.
const ordersRouter = Router()
ordersRouter.get('/', authenticate, orders.list)
ordersRouter.get('/:id', authenticate, orders.getById)
ordersRouter.post('/', authenticate, orders.create)
ordersRouter.patch('/:id/status', ...adminGuard, orders.updateStatus)
ordersRouter.delete('/:id', authenticate, orders.remove)
router.use('/orders', ordersRouter)

// Painel administrativo.
const adminRouter = Router()
adminRouter.get('/orders', ...adminGuard, orders.adminList)
adminRouter.get('/products/low-stock', ...adminGuard, products.lowStock)
router.use('/admin', adminRouter)

module.exports = router
