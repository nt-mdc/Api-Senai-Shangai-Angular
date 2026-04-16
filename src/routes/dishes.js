const { Router } = require('express')
const dishController = require('../controllers/dishController')

const router = Router()

router.get('/', dishController.list)
router.get('/:id', dishController.getById)

module.exports = router
