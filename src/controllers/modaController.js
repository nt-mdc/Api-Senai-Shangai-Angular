const prisma = require('../config/database');
const { put } = require('@vercel/blob');

exports.create = async (req, res, next) => {
  try {
    const { nome, categoria, preco, tag } = req.body;
    let imagem_url = '';
    if (req.file) {
      const blob = await put(req.file.originalname, req.file.buffer, { access: 'public' });
      imagem_url = blob.url;
    }
    const item = await prisma.modaItem.create({
      data: {
        nome,
        categoria,
        preco: parseFloat(preco),
        tag: tag || null,
        imagem_url
      }
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const items = await prisma.modaItem.findMany();
    res.json(items);
  } catch (err) {
    next(err);
  }
};