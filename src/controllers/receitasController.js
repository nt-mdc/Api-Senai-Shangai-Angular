const { put, del } = require('@vercel/blob');
const slugify = require('slugify');
const prisma = require('../config/database');

async function uploadImage(file, name) {
  const slug = slugify(name || 'receita', { lower: true });
  const pathname = `receitas/${slug}/${Date.now()}-${file.originalname}`;
  const blob = await put(pathname, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
  });
  return blob.url;
}

exports.create = async (req, res, next) => {
  try {
    const { categoria, titulo, ingredientes_principais, tempo_preparo, dificuldade } = req.body;
    let imagem_url = '';
    if (req.file) {
      imagem_url = await uploadImage(req.file, titulo);
    }
    const recipe = await prisma.recipe.create({
      data: {
        categoria,
        titulo,
        ingredientes_principais: typeof ingredientes_principais === 'string'
          ? JSON.parse(ingredientes_principais)
          : ingredientes_principais,
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

exports.getById = async (req, res, next) => {
  try {
    const recipe = await prisma.recipe.findUnique({ where: { id: req.params.id } });
    if (!recipe) return res.status(404).json({ error: 'Receita não encontrada' });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await prisma.recipe.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Receita não encontrada' });

    const { categoria, titulo, ingredientes_principais, tempo_preparo, dificuldade } = req.body;
    const data = {};
    if (categoria !== undefined) data.categoria = categoria;
    if (titulo !== undefined) data.titulo = titulo;
    if (ingredientes_principais !== undefined) {
      data.ingredientes_principais = typeof ingredientes_principais === 'string'
        ? JSON.parse(ingredientes_principais)
        : ingredientes_principais;
    }
    if (tempo_preparo !== undefined) data.tempo_preparo = tempo_preparo;
    if (dificuldade !== undefined) data.dificuldade = dificuldade;
    if (req.file) {
      if (existing.imagem_url) await del(existing.imagem_url).catch(() => {});
      data.imagem_url = await uploadImage(req.file, titulo || existing.titulo);
    }
    const recipe = await prisma.recipe.update({ where: { id: req.params.id }, data });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const existing = await prisma.recipe.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Receita não encontrada' });
    if (existing.imagem_url) await del(existing.imagem_url).catch(() => {});
    await prisma.recipe.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
