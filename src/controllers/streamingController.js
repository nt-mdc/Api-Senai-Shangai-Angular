const { put, del } = require('@vercel/blob');
const slugify = require('slugify');
const prisma = require('../config/database');

async function uploadImage(file, name) {
  const slug = slugify(name || 'movie', { lower: true });
  const pathname = `streaming/${slug}/${Date.now()}-${file.originalname}`;
  const blob = await put(pathname, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
  });
  return blob.url;
}

exports.createMovie = async (req, res, next) => {
  try {
    const { titulo, genero, ano_lancamento, nota } = req.body;
    let imagem_url = '';
    if (req.file) {
      imagem_url = await uploadImage(req.file, titulo);
    }
    const movie = await prisma.movie.create({
      data: {
        titulo,
        genero,
        ano_lancamento: parseInt(ano_lancamento),
        nota,
        imagem_url
      }
    });
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
};

exports.listMovies = async (req, res, next) => {
  try {
    const movies = await prisma.movie.findMany();
    res.json(movies);
  } catch (err) {
    next(err);
  }
};

exports.getMovie = async (req, res, next) => {
  try {
    const movie = await prisma.movie.findUnique({ where: { id: req.params.id } });
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json(movie);
  } catch (err) {
    next(err);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    const existing = await prisma.movie.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Filme não encontrado' });

    const { titulo, genero, ano_lancamento, nota } = req.body;
    const data = {};
    if (titulo !== undefined) data.titulo = titulo;
    if (genero !== undefined) data.genero = genero;
    if (ano_lancamento !== undefined) data.ano_lancamento = parseInt(ano_lancamento);
    if (nota !== undefined) data.nota = nota;
    if (req.file) {
      if (existing.imagem_url) await del(existing.imagem_url).catch(() => {});
      data.imagem_url = await uploadImage(req.file, titulo || existing.titulo);
    }
    const movie = await prisma.movie.update({ where: { id: req.params.id }, data });
    res.json(movie);
  } catch (err) {
    next(err);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const existing = await prisma.movie.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Filme não encontrado' });
    if (existing.imagem_url) await del(existing.imagem_url).catch(() => {});
    await prisma.movie.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.listStats = async (req, res, next) => {
  try {
    const stats = await prisma.streamingStats.findMany();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

exports.updateStats = async (req, res, next) => {
  try {
    const { mais_assistidos_semana, total_horas_assistidas } = req.body;
    const stats = await prisma.streamingStats.create({
      data: {
        mais_assistidos_semana: typeof mais_assistidos_semana === 'string'
          ? JSON.parse(mais_assistidos_semana)
          : mais_assistidos_semana,
        total_horas_assistidas
      }
    });
    res.status(201).json(stats);
  } catch (err) {
    next(err);
  }
};

exports.editStats = async (req, res, next) => {
  try {
    const { mais_assistidos_semana, total_horas_assistidas } = req.body;
    const data = {};
    if (mais_assistidos_semana !== undefined) {
      data.mais_assistidos_semana = typeof mais_assistidos_semana === 'string'
        ? JSON.parse(mais_assistidos_semana)
        : mais_assistidos_semana;
    }
    if (total_horas_assistidas !== undefined) data.total_horas_assistidas = total_horas_assistidas;
    const stats = await prisma.streamingStats.update({ where: { id: req.params.id }, data });
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

exports.deleteStats = async (req, res, next) => {
  try {
    await prisma.streamingStats.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
