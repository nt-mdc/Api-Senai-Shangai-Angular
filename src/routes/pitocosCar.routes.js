const { Router } = require('express')
const upload = require('../middlewares/upload')
const { authenticate } = require('../middlewares/auth')
const events = require('../controllers/carEvents.controller')
const regs = require('../controllers/vehicleRegistrations.controller')

// PROJETO 2 — Pitoco's Car (eventos de carros clássicos)
const router = Router()

// Eventos têm dois campos de imagem: banner (image) e foto do organizador.
const eventUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'organizerPhoto', maxCount: 1 }
])

router.get('/events', events.list)
router.get('/events/:id', events.getById)
router.post('/events', authenticate, eventUpload, events.create)
router.put('/events/:id', authenticate, eventUpload, events.update)
router.patch('/events/:id', authenticate, eventUpload, events.update)
router.delete('/events/:id', authenticate, events.remove)

// Inscrições de veículos, aninhadas em /events/:eventId/registrations
const registrations = Router({ mergeParams: true })
registrations.get('/', authenticate, regs.list)
registrations.get('/:id', authenticate, regs.getById)
registrations.post('/', upload.single('image'), regs.create) // submissão pública
registrations.put('/:id', authenticate, upload.single('image'), regs.update)
registrations.patch('/:id/status', authenticate, regs.updateStatus)
registrations.delete('/:id', authenticate, regs.remove)

router.use('/events/:eventId/registrations', registrations)

module.exports = router
