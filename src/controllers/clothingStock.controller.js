const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl, toInt } = require('../utils/http')

const FOLDER = 'lumiere/stock'

function serialize (s) {
  if (!s) return s
  const { image, product, size, ...rest } = s
  const out = { ...rest, image_url: imageUrl(image) }
  if (product) out.product = { ...product, image_url: imageUrl(product.image) }
  if (size) out.size = { ...size, image_url: imageUrl(size.image) }
  return out
}

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const where = {}
    if (req.query.productId) where.productId = parseInt(req.query.productId)
    if (req.query.sizeId) where.sizeId = parseInt(req.query.sizeId)

    const [items, total] = await Promise.all([
      prisma.clothingStock.findMany({ where, include: { product: true, size: true }, orderBy: { id: 'asc' }, skip, take }),
      prisma.clothingStock.count({ where })
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const stock = await prisma.clothingStock.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { product: true, size: true }
    })
    if (!stock) return res.status(404).json({ error: 'Entrada de estoque não encontrada' })
    res.json({ data: serialize(stock), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const productId = toInt(req.body.productId)
    const sizeId = toInt(req.body.sizeId)

    const details = []
    if (productId === undefined) details.push('O campo productId é obrigatório')
    if (sizeId === undefined) details.push('O campo sizeId é obrigatório')
    if (details.length) return res.status(422).json({ error: 'Dados inválidos', details })

    const clash = await prisma.clothingStock.findUnique({ where: { productId_sizeId: { productId, sizeId } } })
    if (clash) return res.status(422).json({ error: 'Já existe estoque para este produto e tamanho' })

    let image = null
    if (req.file) image = await uploadBlob(req.file, FOLDER)

    const stock = await prisma.clothingStock.create({
      data: { productId, sizeId, quantity: toInt(req.body.quantity), image },
      include: { product: true, size: true }
    })
    res.status(201).json({ data: serialize(stock), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.clothingStock.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Entrada de estoque não encontrada' })

    const data = {}
    if (req.body.quantity !== undefined) data.quantity = toInt(req.body.quantity)
    if (req.file) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(req.file, FOLDER)
    }

    const stock = await prisma.clothingStock.update({ where: { id }, data, include: { product: true, size: true } })
    res.json({ data: serialize(stock), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.clothingStock.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Entrada de estoque não encontrada' })
    await deleteBlob(existing.image)
    await prisma.clothingStock.delete({ where: { id } })
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}
