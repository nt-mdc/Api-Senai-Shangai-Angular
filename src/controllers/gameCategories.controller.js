const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl } = require('../utils/http')

const FOLDER = 'maxblock/categories'

function serializeGame (g) {
  const { image, ...rest } = g
  return { ...rest, image_url: imageUrl(image) }
}

function serialize (c) {
  if (!c) return c
  const { image, games, ...rest } = c
  return {
    ...rest,
    image_url: imageUrl(image),
    games: Array.isArray(games) ? games.map(serializeGame) : undefined
  }
}

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const [items, total] = await Promise.all([
      prisma.gameCategory.findMany({ orderBy: { name: 'asc' }, skip, take }),
      prisma.gameCategory.count()
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const category = await prisma.gameCategory.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { games: { orderBy: { name: 'asc' } } }
    })
    if (!category) return res.status(404).json({ error: 'Categoria não encontrada' })
    res.json({ data: serialize(category), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body
    if (!name) return res.status(422).json({ error: 'Dados inválidos', details: ['O campo name é obrigatório'] })

    const exists = await prisma.gameCategory.findUnique({ where: { name } })
    if (exists) return res.status(422).json({ error: 'Já existe uma categoria com este nome' })

    let image = null
    if (req.file) image = await uploadBlob(req.file, FOLDER)

    const category = await prisma.gameCategory.create({ data: { name, image } })
    res.status(201).json({ data: serialize(category), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.gameCategory.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Categoria não encontrada' })

    const data = {}
    if (req.body.name !== undefined && req.body.name !== existing.name) {
      const clash = await prisma.gameCategory.findUnique({ where: { name: req.body.name } })
      if (clash) return res.status(422).json({ error: 'Já existe uma categoria com este nome' })
      data.name = req.body.name
    }
    if (req.file) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(req.file, FOLDER)
    }

    const category = await prisma.gameCategory.update({ where: { id }, data })
    res.json({ data: serialize(category), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.gameCategory.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Categoria não encontrada' })
    await deleteBlob(existing.image)
    await prisma.gameCategory.delete({ where: { id } })
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}
