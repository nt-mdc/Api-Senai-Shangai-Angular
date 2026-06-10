const prisma = require('../config/database');

exports.create = async (req, res, next) => {
  try {
    const { titulo, descricao, categoria, tempo_leitura, imagem, data_publicacao } = req.body;
    if (!titulo || !descricao || !categoria || !tempo_leitura || !data_publicacao) {
      return res.status(400).json({ error: 'Título, descrição, categoria, tempo de leitura e data de publicação são obrigatórios' });
    }
    const artigo = await prisma.artigo.create({
      data: {
        titulo,
        descricao,
        categoria,
        tempo_leitura: parseInt(tempo_leitura),
        imagem: imagem || null,
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
