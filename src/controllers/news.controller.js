const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl, toDate } = require('../utils/http')

const FOLDER = 'dentro-do-jogo/news'

function serialize (item) {
  if (!item) return item
  const { image, ...rest } = item
  return { ...rest, image_url: imageUrl(image) }
}

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const where = {}
    if (req.query.category) where.category = req.query.category

    const [items, total] = await Promise.all([
      prisma.news.findMany({ where, orderBy: { publishedAt: 'desc' }, skip, take }),
      prisma.news.count({ where })
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const item = await prisma.news.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!item) return res.status(404).json({ error: 'Notícia não encontrada' })
    res.json({ data: serialize(item), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { title, content, summary, author, category } = req.body
    const publishedAt = toDate(req.body.publishedAt)

    const details = []
    if (!title) details.push('O campo title é obrigatório')
    if (!content) details.push('O campo content é obrigatório')
    if (!summary) details.push('O campo summary é obrigatório')
    if (!author) details.push('O campo author é obrigatório')
    if (!category) details.push('O campo category é obrigatório')
    if (!publishedAt) details.push('O campo publishedAt é obrigatório e deve ser uma data válida')
    if (details.length) return res.status(422).json({ error: 'Dados inválidos', details })

    let image = null
    if (req.file) image = await uploadBlob(req.file, FOLDER)

    const item = await prisma.news.create({
      data: { title, content, summary, author, category, publishedAt, image }
    })
    res.status(201).json({ data: serialize(item), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.news.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Notícia não encontrada' })

    const data = {}
    if (req.body.title !== undefined) data.title = req.body.title
    if (req.body.content !== undefined) data.content = req.body.content
    if (req.body.summary !== undefined) data.summary = req.body.summary
    if (req.body.author !== undefined) data.author = req.body.author
    if (req.body.category !== undefined) data.category = req.body.category
    if (req.body.publishedAt !== undefined) data.publishedAt = toDate(req.body.publishedAt)
    if (req.file) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(req.file, FOLDER)
    }

    const item = await prisma.news.update({ where: { id }, data })
    res.json({ data: serialize(item), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.news.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Notícia não encontrada' })
    await deleteBlob(existing.image)
    await prisma.news.delete({ where: { id } })
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}
