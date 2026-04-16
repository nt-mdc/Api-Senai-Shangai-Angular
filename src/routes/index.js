const { Router } = require('express')
const authRoutes = require('./auth')
const turismRoutes = require('./turism')
const petRoutes = require('./pets')
const courseRoutes = require('./courses')
const propertyRoutes = require('./properties')
const dishRoutes = require('./dishes')
const adminRoutes = require('./admin')

const router = Router()

router.use('/auth', authRoutes)
router.use('/turism', turismRoutes)
router.use('/pets', petRoutes)
router.use('/courses', courseRoutes)
router.use('/properties', propertyRoutes)
router.use('/dishes', dishRoutes)
router.use('/admin', adminRoutes)

module.exports = router
