const prisma = require('../config/database');
const { put } = require('@vercel/blob');

exports.createMovie = async (req, res, next) => {
  try {
    const { titulo, genero, ano_lancamento, nota } = req.body;
    let imagem_url = '';
    if (req.file) {
      const blob = await put(req.file.originalname, req.file.buffer, { access: 'public' });
      imagem_url = blob.url;
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

exports.updateStats = async (req, res, next) => {
  try {
    const { mais_assistidos_semana, total_horas_assistidas } = req.body;
    const stats = await prisma.streamingStats.create({
      data: {
        mais_assistidos_semana: JSON.parse(mais_assistidos_semana),
        total_horas_assistidas
      }
    });
    res.status(201).json(stats);
  } catch (err) {
    next(err);
  }
};