const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl } = require('./http')

// Factory para recursos simples: campos name, description, image + busca ?search=
// (name OU description, case-insensitive). Usada por recursos sem relacionamentos.
function simpleResourceController ({ model, folder, notFound }) {
  const db = () => prisma[model]

  const serialize = (r) => {
    if (!r) return r
    const { image, ...rest } = r
    return { ...rest, image_url: imageUrl(image) }
  }

  return {
    list: async (req, res, next) => {
      try {
        const { page, perPage, skip, take } = getPagination(req)
        const where = {}
        if (req.query.search) {
          where.OR = [
            { name: { contains: req.query.search, mode: 'insensitive' } },
            { description: { contains: req.query.search, mode: 'insensitive' } }
          ]
        }
        const [items, total] = await Promise.all([
          db().findMany({ where, orderBy: { name: 'asc' }, skip, take }),
          db().count({ where })
        ])
        res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
      } catch (err) {
        next(err)
      }
    },

    getById: async (req, res, next) => {
      try {
        const item = await db().findUnique({ where: { id: parseInt(req.params.id) } })
        if (!item) return res.status(404).json({ error: notFound })
        res.json({ data: serialize(item), message: 'OK' })
      } catch (err) {
        next(err)
      }
    },

    create: async (req, res, next) => {
      try {
        const { name, description } = req.body
        const details = []
        if (!name) details.push('O campo name é obrigatório')
        if (!description) details.push('O campo description é obrigatório')
        if (details.length) return res.status(422).json({ error: 'Dados inválidos', details })

        let image = null
        if (req.file) image = await uploadBlob(req.file, folder)

        const item = await db().create({ data: { name, description, image } })
        res.status(201).json({ data: serialize(item), message: 'Criado com sucesso' })
      } catch (err) {
        next(err)
      }
    },

    update: async (req, res, next) => {
      try {
        const id = parseInt(req.params.id)
        const existing = await db().findUnique({ where: { id } })
        if (!existing) return res.status(404).json({ error: notFound })

        const data = {}
        if (req.body.name !== undefined) data.name = req.body.name
        if (req.body.description !== undefined) data.description = req.body.description
        if (req.file) {
          await deleteBlob(existing.image)
          data.image = await uploadBlob(req.file, folder)
        }

        const item = await db().update({ where: { id }, data })
        res.json({ data: serialize(item), message: 'Atualizado com sucesso' })
      } catch (err) {
        next(err)
      }
    },

    remove: async (req, res, next) => {
      try {
        const id = parseInt(req.params.id)
        const existing = await db().findUnique({ where: { id } })
        if (!existing) return res.status(404).json({ error: notFound })
        await deleteBlob(existing.image)
        await db().delete({ where: { id } })
        res.json({ message: 'Removido com sucesso' })
      } catch (err) {
        next(err)
      }
    }
  }
}

module.exports = simpleResourceController
