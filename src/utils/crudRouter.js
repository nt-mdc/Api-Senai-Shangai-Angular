const { Router } = require('express')
const upload = require('../middlewares/upload')

// Monta um router CRUD padrão (index/getById/create/update[PUT+PATCH]/remove).
// - guard: middleware(s) de auth aplicados às rotas de escrita (default: nenhum).
// - imageField: nome do campo de upload (default 'image'); null desativa o multer.
function crudRouter (controller, { guard = [], imageField = 'image' } = {}) {
  const guards = Array.isArray(guard) ? guard : [guard]
  const writeMw = imageField ? [...guards, upload.single(imageField)] : guards

  const r = Router()
  r.get('/', controller.list)
  r.get('/:id', controller.getById)
  r.post('/', ...writeMw, controller.create)
  r.put('/:id', ...writeMw, controller.update)
  r.patch('/:id', ...writeMw, controller.update)
  r.delete('/:id', ...guards, controller.remove)
  return r
}

module.exports = crudRouter
