const express = require('express');
const router = express.Router();
const controller = require('../controllers/modaController');
const upload = require('../config/multer');
const adminGuard = require('../middlewares/adminGuard');

router.get('/', controller.list);
router.get('/:id', controller.getById);

router.post('/', adminGuard, upload.single('imagem'), controller.create);
router.put('/:id', adminGuard, upload.single('imagem'), controller.update);
router.delete('/:id', adminGuard, controller.remove);

module.exports = router;
