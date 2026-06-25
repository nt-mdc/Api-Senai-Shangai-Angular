const express = require('express');
const router = express.Router();
const controller = require('../controllers/hardwareController');
const videoController = require('../controllers/hardwareVideoController');
const upload = require('../config/multer');
const adminGuard = require('../middlewares/adminGuard');

// Hardware Videos
router.get('/videos', videoController.list);
router.get('/videos/:id', videoController.getById);

router.post('/videos', adminGuard, videoController.create);
router.put('/videos/:id', adminGuard, videoController.update);
router.delete('/videos/:id', adminGuard, videoController.remove);

// Hardware Items
router.get('/', controller.list);
router.get('/:id', controller.getById);

router.post('/', adminGuard, upload.single('imagem'), controller.create);
router.put('/:id', adminGuard, upload.single('imagem'), controller.update);
router.delete('/:id', adminGuard, controller.remove);

module.exports = router;
