const express = require('express');
const router = express.Router();
const controller = require('../controllers/streamingController');
const upload = require('../config/multer');
const adminGuard = require('../middlewares/adminGuard');

router.get('/movies', controller.listMovies);
router.get('/movies/:id', controller.getMovie);
router.get('/stats', controller.listStats);

router.post('/movies', adminGuard, upload.single('imagem'), controller.createMovie);
router.put('/movies/:id', adminGuard, upload.single('imagem'), controller.updateMovie);
router.delete('/movies/:id', adminGuard, controller.deleteMovie);

router.post('/stats', adminGuard, controller.updateStats);
router.put('/stats/:id', adminGuard, controller.editStats);
router.delete('/stats/:id', adminGuard, controller.deleteStats);

module.exports = router;
