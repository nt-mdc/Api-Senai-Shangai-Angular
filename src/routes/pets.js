const { Router } = require('express')
const petController = require('../controllers/petController')

const router = Router()

router.get('/', petController.list)
router.get('/:id', petController.getById)

module.exports = router
