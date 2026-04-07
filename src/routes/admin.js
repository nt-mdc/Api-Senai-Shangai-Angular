const { Router } = require('express')
const adminGuard = require('../middlewares/adminGuard')
const authController = require('../controllers/authController')
const turismController = require('../controllers/turismController')
const upload = require('../config/multer')

const router = Router()

// All admin routes require adminGuard
router.use(adminGuard)

// Admin user management
router.post('/admin', authController.createAdmin)

// Admin turism CRUD
router.post('/turism', upload.array('images', 5), turismController.create)
router.put('/turism/:id', upload.array('images', 5), turismController.update)
router.delete('/turism/:id', turismController.remove)

module.exports = router
