const { Router } = require('express')
const courseController = require('../controllers/courseController')

const router = Router()

router.get('/', courseController.list)
router.get('/:id', courseController.getById)

module.exports = router
