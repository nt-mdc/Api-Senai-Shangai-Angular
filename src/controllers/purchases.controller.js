const prisma = require('../config/database')
const { getPagination, paginationMeta, imageUrl, toInt } = require('../utils/http')

const STATUSES = ['Pendente', 'Pago', 'Cancelado']

function serializeItem (it) {
  const { image, product, size, ...rest } = it
  const out = { ...rest, image_url: imageUrl(image) }
  if (product) out.product = { ...product, image_url: imageUrl(product.image) }
  if (size) out.size = { ...size, image_url: imageUrl(size.image) }
  return out
}

function serialize (p) {
  if (!p) return p
  const { image, items, ...rest } = p
  return {
    ...rest,
    image_url: imageUrl(image),
    items: Array.isArray(items) ? items.map(serializeItem) : undefined
  }
}

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const [items, total] = await Promise.all([
      prisma.purchase.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.purchase.count()
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { items: { include: { product: true, size: true } } }
    })
    if (!purchase) return res.status(404).json({ error: 'Compra não encontrada' })
    res.json({ data: serialize(purchase), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

// POST público — body JSON: { customerName, customerEmail, items: [{ productId, sizeId, quantity }] }
exports.create = async (req, res, next) => {
  try {
    const { customerName, customerEmail } = req.body
    const items = req.body.items

    const details = []
    if (!customerName) details.push('O campo customerName é obrigatório')
    if (!customerEmail) details.push('O campo customerEmail é obrigatório')
    if (!Array.isArray(items) || items.length === 0) details.push('O campo items deve ser um array não vazio')
    if (details.length) return res.status(422).json({ error: 'Dados inválidos', details })

    // Pré-validação: estoque suficiente para todos os itens + captura do preço atual.
    const resolved = []
    for (const it of items) {
      const productId = toInt(it.productId)
      const sizeId = toInt(it.sizeId)
      const quantity = toInt(it.quantity)
      if (productId === undefined || sizeId === undefined || quantity === undefined || quantity < 1) {
        return res.status(422).json({ error: 'Cada item precisa de productId, sizeId e quantity (>= 1) válidos' })
      }
      const stock = await prisma.clothingStock.findUnique({
        where: { productId_sizeId: { productId, sizeId } },
        include: { product: true, size: true }
      })
      if (!stock) {
        return res.status(422).json({ error: `Não há estoque para o produto ${productId} no tamanho ${sizeId}` })
      }
      if (stock.quantity < quantity) {
        return res.status(422).json({
          error: `Estoque insuficiente para "${stock.product.name}" (tamanho ${stock.size.label}): disponível ${stock.quantity}, solicitado ${quantity}`
        })
      }
      resolved.push({ productId, sizeId, quantity, unitPrice: stock.product.price })
    }

    const total = resolved.reduce((sum, r) => sum + Number(r.unitPrice) * r.quantity, 0)

    const purchase = await prisma.$transaction(async (tx) => {
      const created = await tx.purchase.create({
        data: { customerName, customerEmail, total, status: 'Pendente' }
      })
      for (const r of resolved) {
        await tx.purchaseItem.create({
          data: {
            purchaseId: created.id,
            productId: r.productId,
            sizeId: r.sizeId,
            quantity: r.quantity,
            unitPrice: r.unitPrice
          }
        })
        await tx.clothingStock.update({
          where: { productId_sizeId: { productId: r.productId, sizeId: r.sizeId } },
          data: { quantity: { decrement: r.quantity } }
        })
      }
      return tx.purchase.findUnique({
        where: { id: created.id },
        include: { items: { include: { product: true, size: true } } }
      })
    })

    res.status(201).json({ data: serialize(purchase), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.purchase.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Compra não encontrada' })

    const data = {}
    if (req.body.customerName !== undefined) data.customerName = req.body.customerName
    if (req.body.customerEmail !== undefined) data.customerEmail = req.body.customerEmail
    if (req.body.status !== undefined) {
      if (!STATUSES.includes(req.body.status)) {
        return res.status(422).json({ error: 'Status inválido', details: STATUSES })
      }
      data.status = req.body.status
    }

    const purchase = await prisma.purchase.update({ where: { id }, data, include: { items: true } })
    res.json({ data: serialize(purchase), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

// PATCH /:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.purchase.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Compra não encontrada' })

    const { status } = req.body
    if (!status || !STATUSES.includes(status)) {
      return res.status(422).json({ error: 'Status inválido', details: STATUSES })
    }

    const purchase = await prisma.purchase.update({ where: { id }, data: { status }, include: { items: true } })
    res.json({ data: serialize(purchase), message: 'Status atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.purchase.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Compra não encontrada' })
    await prisma.$transaction([
      prisma.purchaseItem.deleteMany({ where: { purchaseId: id } }),
      prisma.purchase.delete({ where: { id } })
    ])
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}
