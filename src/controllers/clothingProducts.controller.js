const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl, toInt, toDecimal } = require('../utils/http')

const FOLDER = 'lumiere/products'

function serialize (p) {
  if (!p) return p
  const { image, category, ...rest } = p
  const out = { ...rest, image_url: imageUrl(image) }
  if (category) out.category = { ...category, image_url: imageUrl(category.image) }
  return out
}

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const where = {}
    if (req.query.categoryId) where.categoryId = parseInt(req.query.categoryId)
    if (req.query.search) where.name = { contains: req.query.search, mode: 'insensitive' }

    const [items, total] = await Promise.all([
      prisma.clothingProduct.findMany({ where, orderBy: { name: 'asc' }, skip, take }),
      prisma.clothingProduct.count({ where })
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const product = await prisma.clothingProduct.findUnique({ where: { id }, include: { category: true } })
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' })

    const stock = await prisma.clothingStock.findMany({ where: { productId: id }, include: { size: true } })
    const stockBySize = stock.map((s) => ({
      sizeId: s.sizeId,
      sizeLabel: s.size.label,
      quantity: s.quantity,
      image_url: imageUrl(s.image)
    }))

    res.json({ data: { ...serialize(product), stockBySize }, message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { name, description } = req.body
    const price = toDecimal(req.body.price)
    const categoryId = toInt(req.body.categoryId)

    const details = []
    if (!name) details.push('O campo name é obrigatório')
    if (price === undefined) details.push('O campo price é obrigatório')
    if (categoryId === undefined) details.push('O campo categoryId é obrigatório')
    if (details.length) return res.status(422).json({ error: 'Dados inválidos', details })

    let image = null
    if (req.file) image = await uploadBlob(req.file, FOLDER)

    const product = await prisma.clothingProduct.create({
      data: { name, description: description ?? null, price, categoryId, image }
    })
    res.status(201).json({ data: serialize(product), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.clothingProduct.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Produto não encontrado' })

    const data = {}
    if (req.body.name !== undefined) data.name = req.body.name
    if (req.body.description !== undefined) data.description = req.body.description || null
    if (req.body.price !== undefined) data.price = toDecimal(req.body.price)
    if (req.body.categoryId !== undefined) data.categoryId = toInt(req.body.categoryId)
    if (req.file) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(req.file, FOLDER)
    }

    const product = await prisma.clothingProduct.update({ where: { id }, data, include: { category: true } })
    res.json({ data: serialize(product), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.clothingProduct.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Produto não encontrado' })
    await deleteBlob(existing.image)
    await prisma.clothingProduct.delete({ where: { id } })
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}
