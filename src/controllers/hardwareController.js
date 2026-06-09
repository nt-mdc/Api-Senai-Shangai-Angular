const prisma = require('../config/database');
const { put } = require('@vercel/blob');

exports.create = async (req, res, next) => {
  try {
    const { tipo, fabricante, especificacao_principal, preco } = req.body;
    let imagem_url = '';
    if (req.file) {
      const blob = await put(req.file.originalname, req.file.buffer, { access: 'public' });
      imagem_url = blob.url;
    }
    const hw = await prisma.hardwareItem.create({
      data: {
        tipo,
        fabricante,
        especificacao_principal,
        preco: parseFloat(preco),
        imagem_url
      }
    });
    res.status(201).json(hw);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const items = await prisma.hardwareItem.findMany();
    res.json(items);
  } catch (err) {
    next(err);
  }
};