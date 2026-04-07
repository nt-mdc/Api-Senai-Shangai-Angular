const { Router } = require('express')
const authRoutes = require('./auth')
const turismRoutes = require('./turism')
const adminRoutes = require('./admin')

const router = Router()

router.use('/auth', authRoutes)
router.use('/turism', turismRoutes)
router.use('/admin', adminRoutes)

module.exports = router
