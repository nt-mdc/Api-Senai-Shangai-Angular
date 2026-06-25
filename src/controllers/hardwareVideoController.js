const prisma = require('../config/database');

exports.create = async (req, res, next) => {
  try {
    const { url, titulo, descricao } = req.body;
    if (!url || !titulo || !descricao) {
      return res.status(400).json({ error: 'URL, título e descrição são obrigatórios' });
    }
    const video = await prisma.hardwareVideo.create({
      data: { url, titulo, descricao }
    });
    res.status(201).json(video);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const videos = await prisma.hardwareVideo.findMany();
    res.json(videos);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const video = await prisma.hardwareVideo.findUnique({ where: { id: req.params.id } });
    if (!video) return res.status(404).json({ error: 'Vídeo não encontrado' });
    res.json(video);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await prisma.hardwareVideo.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Vídeo não encontrado' });

    const { url, titulo, descricao } = req.body;
    const data = {};
    if (url !== undefined) data.url = url;
    if (titulo !== undefined) data.titulo = titulo;
    if (descricao !== undefined) data.descricao = descricao;

    const video = await prisma.hardwareVideo.update({ where: { id: req.params.id }, data });
    res.json(video);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const existing = await prisma.hardwareVideo.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Vídeo não encontrado' });

    await prisma.hardwareVideo.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
