const simpleResourceController = require('../utils/simpleResource')

module.exports = simpleResourceController({
  model: 'beach',
  folder: 'swell-point/beaches',
  notFound: 'Praia não encontrada'
})
