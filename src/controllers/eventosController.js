const prisma = require('../config/database');
const { put } = require('@vercel/blob');

exports.createEvent = async (req, res, next) => {
  try {
    const { nome, data, local, ingressos_restantes } = req.body;
    let imagem_url = '';
    if (req.file) {
      const blob = await put(req.file.originalname, req.file.buffer, { access: 'public' });
      imagem_url = blob.url;
    }
    const event = await prisma.eventProject.create({
      data: {
        nome,
        data,
        local,
        ingressos_restantes: parseInt(ingressos_restantes),
        imagem_url
      }
    });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

exports.listEvents = async (req, res, next) => {
  try {
    const events = await prisma.eventProject.findMany();
    res.json(events);
  } catch (err) {
    next(err);
  }
};

exports.updateDashboard = async (req, res, next) => {
  try {
    const { total_eventos, eventos_proximos, ingressos_disponiveis } = req.body;
    const dash = await prisma.eventDashboard.create({
      data: {
        total_eventos: parseInt(total_eventos),
        eventos_proximos: parseInt(eventos_proximos),
        ingressos_disponiveis: parseInt(ingressos_disponiveis)
      }
    });
    res.status(201).json(dash);
  } catch (err) {
    next(err);
  }
};