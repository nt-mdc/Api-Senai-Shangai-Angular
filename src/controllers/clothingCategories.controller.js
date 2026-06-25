const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl } = require('../utils/http')

const FOLDER = 'lumiere/categories'

function serializeProduct (p) {
  const { image, ...rest } = p
  return { ...rest, image_url: imageUrl(image) }
}

function serialize (c) {
  if (!c) return c
  const { image, products, ...rest } = c
  return {
    ...rest,
    image_url: imageUrl(image),
    products: Array.isArray(products) ? products.map(serializeProduct) : undefined
  }
}

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const [items, total] = await Promise.all([
      prisma.clothingCategory.findMany({ orderBy: { name: 'asc' }, skip, take }),
      prisma.clothingCategory.count()
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const category = await prisma.clothingCategory.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { products: { orderBy: { name: 'asc' } } }
    })
    if (!category) return res.status(404).json({ error: 'Categoria não encontrada' })
    res.json({ data: serialize(category), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { name, description } = req.body
    if (!name) return res.status(422).json({ error: 'Dados inválidos', details: ['O campo name é obrigatório'] })

    let image = null
    if (req.file) image = await uploadBlob(req.file, FOLDER)

    const category = await prisma.clothingCategory.create({ data: { name, description: description ?? null, image } })
    res.status(201).json({ data: serialize(category), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.clothingCategory.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Categoria não encontrada' })

    const data = {}
    if (req.body.name !== undefined) data.name = req.body.name
    if (req.body.description !== undefined) data.description = req.body.description || null
    if (req.file) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(req.file, FOLDER)
    }

    const category = await prisma.clothingCategory.update({ where: { id }, data })
    res.json({ data: serialize(category), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.clothingCategory.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Categoria não encontrada' })
    await deleteBlob(existing.image)
    await prisma.clothingCategory.delete({ where: { id } })
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}
