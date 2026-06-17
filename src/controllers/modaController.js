const { put, del } = require('@vercel/blob');
const slugify = require('slugify');
const prisma = require('../config/database');

async function uploadImage(file, name) {
  const slug = slugify(name || 'item', { lower: true });
  const pathname = `moda/${slug}/${Date.now()}-${file.originalname}`;
  const blob = await put(pathname, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
  });
  return blob.url;
}

exports.create = async (req, res, next) => {
  try {
    const { nome, categoria, preco, descricao, tag } = req.body;
    if (!nome || !categoria || preco === undefined || !descricao) {
      return res.status(400).json({ error: 'Nome, categoria, preço e descrição são obrigatórios' });
    }
    let imagem_url = '';
    if (req.file) {
      imagem_url = await uploadImage(req.file, nome);
    }
    const item = await prisma.modaItem.create({
      data: {
        nome,
        categoria,
        preco: parseFloat(preco),
        descricao,
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

exports.getById = async (req, res, next) => {
  try {
    const item = await prisma.modaItem.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await prisma.modaItem.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Item não encontrado' });

    const { nome, categoria, preco, descricao, tag } = req.body;
    const data = {};
    if (nome !== undefined) data.nome = nome;
    if (categoria !== undefined) data.categoria = categoria;
    if (preco !== undefined) data.preco = parseFloat(preco);
    if (descricao !== undefined) data.descricao = descricao;
    if (tag !== undefined) data.tag = tag || null;
    if (req.file) {
      if (existing.imagem_url) await del(existing.imagem_url).catch(() => {});
      data.imagem_url = await uploadImage(req.file, nome || existing.nome);
    }
    const item = await prisma.modaItem.update({ where: { id: req.params.id }, data });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const existing = await prisma.modaItem.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Item não encontrado' });
    if (existing.imagem_url) await del(existing.imagem_url).catch(() => {});
    await prisma.modaItem.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
