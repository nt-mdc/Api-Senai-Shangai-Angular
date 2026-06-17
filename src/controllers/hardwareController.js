const { put, del } = require('@vercel/blob');
const slugify = require('slugify');
const prisma = require('../config/database');

async function uploadImage(file, name) {
  const slug = slugify(name || 'hardware', { lower: true });
  const pathname = `hardware/${slug}/${Date.now()}-${file.originalname}`;
  const blob = await put(pathname, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
  });
  return blob.url;
}

exports.create = async (req, res, next) => {
  try {
    const { titulo, tipo, fabricante, especificacao_principal, preco } = req.body;
    if (!titulo || !tipo || !fabricante || !especificacao_principal || preco === undefined) {
      return res.status(400).json({ error: 'Título, tipo, fabricante, especificação principal e preço são obrigatórios' });
    }
    let imagem_url = '';
    if (req.file) {
      imagem_url = await uploadImage(req.file, titulo);
    }
    const hw = await prisma.hardwareItem.create({
      data: {
        titulo,
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

exports.getById = async (req, res, next) => {
  try {
    const item = await prisma.hardwareItem.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await prisma.hardwareItem.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Item não encontrado' });

    const { titulo, tipo, fabricante, especificacao_principal, preco } = req.body;
    const data = {};
    if (titulo !== undefined) data.titulo = titulo;
    if (tipo !== undefined) data.tipo = tipo;
    if (fabricante !== undefined) data.fabricante = fabricante;
    if (especificacao_principal !== undefined) data.especificacao_principal = especificacao_principal;
    if (preco !== undefined) data.preco = parseFloat(preco);
    if (req.file) {
      if (existing.imagem_url) await del(existing.imagem_url).catch(() => {});
      data.imagem_url = await uploadImage(req.file, titulo || existing.titulo);
    }
    const hw = await prisma.hardwareItem.update({ where: { id: req.params.id }, data });
    res.json(hw);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const existing = await prisma.hardwareItem.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Item não encontrado' });
    if (existing.imagem_url) await del(existing.imagem_url).catch(() => {});
    await prisma.hardwareItem.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
