const express = require('express');
const router = express.Router();
const controller = require('../controllers/modaController');
const upload = require('../config/multer');

router.post('/', upload.single('imagem'), controller.create);
router.get('/', controller.list);

module.exports = router;