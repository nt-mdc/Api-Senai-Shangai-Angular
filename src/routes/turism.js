const { Router } = require('express')
const turismController = require('../controllers/turismController')

const router = Router()

router.get('/', turismController.list)
router.get('/:id', turismController.getById)

module.exports = router
