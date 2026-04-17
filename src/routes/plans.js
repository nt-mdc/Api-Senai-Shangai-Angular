const { Router } = require('express')
const planController = require('../controllers/planController')

const router = Router()

router.get('/', planController.list)
router.get('/:id', planController.getById)

module.exports = router
