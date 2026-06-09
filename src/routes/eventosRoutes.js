const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventosController');
const upload = require('../config/multer');

router.post('/events', upload.single('imagem'), controller.createEvent);
router.get('/events', controller.listEvents);
router.post('/dashboard', controller.updateDashboard);

module.exports = router;