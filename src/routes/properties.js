const { Router } = require('express')
const propertyController = require('../controllers/propertyController')

const router = Router()

router.get('/', propertyController.list)
router.get('/:id', propertyController.getById)

module.exports = router
