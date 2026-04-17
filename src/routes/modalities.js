const { Router } = require('express')
const modalityController = require('../controllers/modalityController')

const router = Router()

router.get('/', modalityController.list)
router.get('/:id', modalityController.getById)

module.exports = router
