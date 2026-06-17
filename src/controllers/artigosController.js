const { put, del } = require('@vercel/blob');
const slugify = require('slugify');
const prisma = require('../config/database');

async function uploadImage(file, name) {
  const slug = slugify(name || 'artigo', { lower: true });
  const pathname = `artigos/${slug}/${Date.now()}-${file.originalname}`;
  const blob = await put(pathname, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
  });
  return blob.url;
}

exports.create = async (req, res, next) => {
  try {
    const { titulo, descricao, categoria, tempo_leitura, data_publicacao } = req.body;
    if (!titulo || !descricao || !categoria || !tempo_leitura || !data_publicacao) {
      return res.status(400).json({ error: 'Título, descrição, categoria, tempo de leitura e data de publicação são obrigatórios' });
    }
    let imagem = null;
    if (req.file) {
      imagem = await uploadImage(req.file, titulo);
    } else if (req.body.imagem) {
      imagem = req.body.imagem;
    }
    const artigo = await prisma.artigo.create({
      data: {
        titulo,
        descricao,
        categoria,
        tempo_leitura: parseInt(tempo_leitura),
        imagem,
        data_publicacao: new Date(data_publicacao)
      }
    });
    res.status(201).json(artigo);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const artigos = await prisma.artigo.findMany({
      orderBy: { data_publicacao: 'desc' }
    });
    res.json(artigos);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const artigo = await prisma.artigo.findUnique({
      where: { id: req.params.id }
    });
    if (!artigo) return res.status(404).json({ error: 'Artigo não encontrado' });
    res.json(artigo);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await prisma.artigo.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Artigo não encontrado' });

    const { titulo, descricao, categoria, tempo_leitura, data_publicacao } = req.body;
    const data = {};
    if (titulo !== undefined) data.titulo = titulo;
    if (descricao !== undefined) data.descricao = descricao;
    if (categoria !== undefined) data.categoria = categoria;
    if (tempo_leitura !== undefined) data.tempo_leitura = parseInt(tempo_leitura);
    if (data_publicacao !== undefined) data.data_publicacao = new Date(data_publicacao);
    if (req.file) {
      if (existing.imagem) await del(existing.imagem).catch(() => {});
      data.imagem = await uploadImage(req.file, titulo || existing.titulo);
    } else if (req.body.imagem !== undefined) {
      data.imagem = req.body.imagem || null;
    }
    const artigo = await prisma.artigo.update({ where: { id: req.params.id }, data });
    res.json(artigo);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const existing = await prisma.artigo.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Artigo não encontrado' });
    if (existing.imagem) await del(existing.imagem).catch(() => {});
    await prisma.artigo.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
