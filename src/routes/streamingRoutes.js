const express = require('express');
const router = express.Router();
const controller = require('../controllers/streamingController');
const upload = require('../config/multer');

router.post('/movies', upload.single('imagem'), controller.createMovie);
router.get('/movies', controller.listMovies);
router.post('/stats', controller.updateStats);

module.exports = router;