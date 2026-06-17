const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventosController');
const upload = require('../config/multer');
const adminGuard = require('../middlewares/adminGuard');

router.get('/events', controller.listEvents);
router.get('/events/:id', controller.getEvent);
router.get('/dashboard', controller.listDashboard);

router.post('/events', adminGuard, upload.single('imagem'), controller.createEvent);
router.put('/events/:id', adminGuard, upload.single('imagem'), controller.updateEvent);
router.delete('/events/:id', adminGuard, controller.deleteEvent);

router.post('/dashboard', adminGuard, controller.updateDashboard);
router.put('/dashboard/:id', adminGuard, controller.editDashboard);
router.delete('/dashboard/:id', adminGuard, controller.deleteDashboard);

module.exports = router;
