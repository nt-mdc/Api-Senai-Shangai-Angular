const prisma = require('../config/database');
const { put } = require('@vercel/blob');

exports.create = async (req, res, next) => {
  try {
    const { categoria, titulo, ingredientes_principais, tempo_preparo, dificuldade } = req.body;
    let imagem_url = '';
    if (req.file) {
      const blob = await put(req.file.originalname, req.file.buffer, { access: 'public' });
      imagem_url = blob.url;
    }
    const recipe = await prisma.recipe.create({
      data: {
        categoria,
        titulo,
        ingredientes_principais: JSON.parse(ingredientes_principais),
        tempo_preparo,
        dificuldade,
        imagem_url
      }
    });
    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const recipes = await prisma.recipe.findMany();
    res.json(recipes);
  } catch (err) {
    next(err);
  }
};