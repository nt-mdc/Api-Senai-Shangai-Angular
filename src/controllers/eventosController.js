const { put, del } = require('@vercel/blob');
const slugify = require('slugify');
const prisma = require('../config/database');

async function uploadImage(file, name) {
  const slug = slugify(name || 'evento', { lower: true });
  const pathname = `eventos/${slug}/${Date.now()}-${file.originalname}`;
  const blob = await put(pathname, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
  });
  return blob.url;
}

exports.createEvent = async (req, res, next) => {
  try {
    const { nome, data, local, ingressos_restantes } = req.body;
    let imagem_url = '';
    if (req.file) {
      imagem_url = await uploadImage(req.file, nome);
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

exports.getEvent = async (req, res, next) => {
  try {
    const event = await prisma.eventProject.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(event);
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const existing = await prisma.eventProject.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Evento não encontrado' });

    const { nome, data, local, ingressos_restantes } = req.body;
    const payload = {};
    if (nome !== undefined) payload.nome = nome;
    if (data !== undefined) payload.data = data;
    if (local !== undefined) payload.local = local;
    if (ingressos_restantes !== undefined) payload.ingressos_restantes = parseInt(ingressos_restantes);
    if (req.file) {
      if (existing.imagem_url) await del(existing.imagem_url).catch(() => {});
      payload.imagem_url = await uploadImage(req.file, nome || existing.nome);
    }
    const event = await prisma.eventProject.update({ where: { id: req.params.id }, data: payload });
    res.json(event);
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const existing = await prisma.eventProject.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Evento não encontrado' });
    if (existing.imagem_url) await del(existing.imagem_url).catch(() => {});
    await prisma.eventProject.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.listDashboard = async (req, res, next) => {
  try {
    const dashboards = await prisma.eventDashboard.findMany();
    res.json(dashboards);
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

exports.editDashboard = async (req, res, next) => {
  try {
    const { total_eventos, eventos_proximos, ingressos_disponiveis } = req.body;
    const data = {};
    if (total_eventos !== undefined) data.total_eventos = parseInt(total_eventos);
    if (eventos_proximos !== undefined) data.eventos_proximos = parseInt(eventos_proximos);
    if (ingressos_disponiveis !== undefined) data.ingressos_disponiveis = parseInt(ingressos_disponiveis);
    const dash = await prisma.eventDashboard.update({ where: { id: req.params.id }, data });
    res.json(dash);
  } catch (err) {
    next(err);
  }
};

exports.deleteDashboard = async (req, res, next) => {
  try {
    await prisma.eventDashboard.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
