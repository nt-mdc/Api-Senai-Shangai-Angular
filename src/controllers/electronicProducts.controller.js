const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl, toInt, toDecimal } = require('../utils/http')

const FOLDER = 'nexus/products'

function serialize (p) {
  if (!p) return p
  const { image, category, ...rest } = p
  const out = { ...rest, image_url: imageUrl(image), lowStock: p.stockQuantity <= p.lowStockThreshold }
  if (category) out.category = { ...category, image_url: imageUrl(category.image) }
  return out
}

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const where = {}
    if (req.query.categoryId) where.categoryId = parseInt(req.query.categoryId)
    if (req.query.brand) where.brand = req.query.brand
    if (req.query.search) where.name = { contains: req.query.search, mode: 'insensitive' }

    // lowStock compara duas colunas (stockQuantity <= lowStockThreshold), que o
    // Prisma não expressa em `where`; filtramos em JS e paginamos manualmente.
    if (req.query.lowStock === 'true') {
      const all = await prisma.electronicProduct.findMany({ where, orderBy: { name: 'asc' } })
      const filtered = all.filter((p) => p.stockQuantity <= p.lowStockThreshold)
      const data = filtered.slice(skip, skip + take).map(serialize)
      return res.json({ data, meta: paginationMeta(page, perPage, filtered.length) })
    }

    const [items, total] = await Promise.all([
      prisma.electronicProduct.findMany({ where, orderBy: { name: 'asc' }, skip, take }),
      prisma.electronicProduct.count({ where })
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const product = await prisma.electronicProduct.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true }
    })
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' })
    res.json({ data: serialize(product), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

// GET /admin/products/low-stock
exports.lowStock = async (req, res, next) => {
  try {
    const all = await prisma.electronicProduct.findMany({ orderBy: { stockQuantity: 'asc' } })
    const filtered = all.filter((p) => p.stockQuantity <= p.lowStockThreshold)
    res.json({ data: filtered.map(serialize), meta: { total: filtered.length } })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { name, brand, description, sku } = req.body
    const price = toDecimal(req.body.price)
    const categoryId = toInt(req.body.categoryId)

    const details = []
    if (!name) details.push('O campo name é obrigatório')
    if (categoryId === undefined) details.push('O campo categoryId é obrigatório')
    if (!brand) details.push('O campo brand é obrigatório')
    if (!description) details.push('O campo description é obrigatório')
    if (price === undefined) details.push('O campo price é obrigatório')
    if (!sku) details.push('O campo sku é obrigatório')
    if (details.length) return res.status(422).json({ error: 'Dados inválidos', details })

    const clash = await prisma.electronicProduct.findUnique({ where: { sku } })
    if (clash) return res.status(422).json({ error: 'Já existe um produto com este sku' })

    let image = null
    if (req.file) image = await uploadBlob(req.file, FOLDER)

    const product = await prisma.electronicProduct.create({
      data: {
        name,
        categoryId,
        brand,
        description,
        price,
        stockQuantity: toInt(req.body.stockQuantity),
        lowStockThreshold: toInt(req.body.lowStockThreshold),
        sku,
        image
      }
    })
    res.status(201).json({ data: serialize(product), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.electronicProduct.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Produto não encontrado' })

    const data = {}
    if (req.body.name !== undefined) data.name = req.body.name
    if (req.body.categoryId !== undefined) data.categoryId = toInt(req.body.categoryId)
    if (req.body.brand !== undefined) data.brand = req.body.brand
    if (req.body.description !== undefined) data.description = req.body.description
    if (req.body.price !== undefined) data.price = toDecimal(req.body.price)
    if (req.body.stockQuantity !== undefined) data.stockQuantity = toInt(req.body.stockQuantity)
    if (req.body.lowStockThreshold !== undefined) data.lowStockThreshold = toInt(req.body.lowStockThreshold)
    if (req.body.sku !== undefined && req.body.sku !== existing.sku) {
      const clash = await prisma.electronicProduct.findUnique({ where: { sku: req.body.sku } })
      if (clash) return res.status(422).json({ error: 'Já existe um produto com este sku' })
      data.sku = req.body.sku
    }
    if (req.file) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(req.file, FOLDER)
    }

    const product = await prisma.electronicProduct.update({ where: { id }, data, include: { category: true } })
    res.json({ data: serialize(product), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.electronicProduct.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Produto não encontrado' })
    await deleteBlob(existing.image)
    await prisma.electronicProduct.delete({ where: { id } })
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}
