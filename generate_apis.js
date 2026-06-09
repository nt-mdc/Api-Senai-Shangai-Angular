const fs = require('fs');
const path = require('path');

const controllers = {
  moda: `
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
`,
  streaming: `
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
`,
  receitas: `
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
`,
  eventos: `
const prisma = require('../config/database');
const { put } = require('@vercel/blob');

exports.createEvent = async (req, res, next) => {
  try {
    const { nome, data, local, ingressos_restantes } = req.body;
    let imagem_url = '';
    if (req.file) {
      const blob = await put(req.file.originalname, req.file.buffer, { access: 'public' });
      imagem_url = blob.url;
    }
    const event = await prisma.eventProject.create({
      data: {
        nome,
        data,
        local,
        ingressos_restantes: parseInt(ingressos_restantes),
        imagem_url
      }
    });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

exports.listEvents = async (req, res, next) => {
  try {
    const events = await prisma.eventProject.findMany();
    res.json(events);
  } catch (err) {
    next(err);
  }
};

exports.updateDashboard = async (req, res, next) => {
  try {
    const { total_eventos, eventos_proximos, ingressos_disponiveis } = req.body;
    const dash = await prisma.eventDashboard.create({
      data: {
        total_eventos: parseInt(total_eventos),
        eventos_proximos: parseInt(eventos_proximos),
        ingressos_disponiveis: parseInt(ingressos_disponiveis)
      }
    });
    res.status(201).json(dash);
  } catch (err) {
    next(err);
  }
};
`,
  hardware: `
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
`
};

const routesConfig = {
  moda: `
const express = require('express');
const router = express.Router();
const controller = require('../controllers/modaController');
const upload = require('../config/multer');

router.post('/', upload.single('imagem'), controller.create);
router.get('/', controller.list);

module.exports = router;
`,
  streaming: `
const express = require('express');
const router = express.Router();
const controller = require('../controllers/streamingController');
const upload = require('../config/multer');

router.post('/movies', upload.single('imagem'), controller.createMovie);
router.get('/movies', controller.listMovies);
router.post('/stats', controller.updateStats);

module.exports = router;
`,
  receitas: `
const express = require('express');
const router = express.Router();
const controller = require('../controllers/receitasController');
const upload = require('../config/multer');

router.post('/', upload.single('imagem'), controller.create);
router.get('/', controller.list);

module.exports = router;
`,
  eventos: `
const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventosController');
const upload = require('../config/multer');

router.post('/events', upload.single('imagem'), controller.createEvent);
router.get('/events', controller.listEvents);
router.post('/dashboard', controller.updateDashboard);

module.exports = router;
`,
  hardware: `
const express = require('express');
const router = express.Router();
const controller = require('../controllers/hardwareController');
const upload = require('../config/multer');

router.post('/', upload.single('imagem'), controller.create);
router.get('/', controller.list);

module.exports = router;
`
};

for (const name of Object.keys(controllers)) {
  fs.writeFileSync(path.join(__dirname, 'src', 'controllers', name + 'Controller.js'), controllers[name].trim() + '\\n');
}

for (const name of Object.keys(routesConfig)) {
  fs.writeFileSync(path.join(__dirname, 'src', 'routes', name + 'Routes.js'), routesConfig[name].trim() + '\\n');
}

console.log('Files generated successfully.');
