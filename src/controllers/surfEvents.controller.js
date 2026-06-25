const simpleResourceController = require('../utils/simpleResource')

module.exports = simpleResourceController({
  model: 'surfEvent',
  folder: 'swell-point/events',
  notFound: 'Evento não encontrado'
})
