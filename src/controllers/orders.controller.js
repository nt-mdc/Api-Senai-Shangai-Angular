const prisma = require('../config/database')
const { getPagination, paginationMeta, imageUrl } = require('../utils/http')

const STATUSES = ['Pendente', 'Pago', 'Enviado', 'Entregue', 'Cancelado']

function serializeItem (it) {
  const { image, product, ...rest } = it
  const out = { ...rest, image_url: imageUrl(image) }
  if (product) out.product = { ...product, image_url: imageUrl(product.image) }
  return out
}

function serialize (order) {
  if (!order) return order
  const { image, items, customer, ...rest } = order
  const out = { ...rest, image_url: imageUrl(image) }
  if (Array.isArray(items)) out.items = items.map(serializeItem)
  if (customer) {
    const { password, image: cImage, ...c } = customer
    out.customer = { ...c, image_url: imageUrl(cImage) }
  }
  return out
}

// GET /orders — pedidos do cliente autenticado.
exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const where = { customerId: req.user.id }
    const [items, total] = await Promise.all([
      prisma.order.findMany({ where, include: { items: true }, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.order.count({ where })
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { items: { include: { product: true } } }
    })
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' })
    if (order.customerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado a este pedido' })
    }
    res.json({ data: serialize(order), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

// POST /orders — cria o pedido a partir do carrinho do cliente.
exports.create = async (req, res, next) => {
  try {
    const customerId = req.user.id
    const cart = await prisma.cartItem.findMany({ where: { customerId }, include: { product: true } })
    if (cart.length === 0) return res.status(422).json({ error: 'Carrinho vazio' })

    for (const item of cart) {
      if (item.product.stockQuantity < item.quantity) {
        return res.status(422).json({
          error: `Estoque insuficiente para "${item.product.name}": disponível ${item.product.stockQuantity}, solicitado ${item.quantity}`
        })
      }
    }

    const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({ data: { customerId, total, status: 'Pendente' } })
      for (const item of cart) {
        await tx.orderItem.create({
          data: {
            orderId: created.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price
          }
        })
        await tx.electronicProduct.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } }
        })
      }
      await tx.cartItem.deleteMany({ where: { customerId } })
      return tx.order.findUnique({ where: { id: created.id }, include: { items: { include: { product: true } } } })
    })

    res.status(201).json({ data: serialize(order), message: 'Pedido criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

// PATCH /orders/:id/status — [AUTH ADMIN]
exports.updateStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.order.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Pedido não encontrado' })

    const { status } = req.body
    if (!status || !STATUSES.includes(status)) {
      return res.status(422).json({ error: 'Status inválido', details: STATUSES })
    }

    const order = await prisma.order.update({ where: { id }, data: { status }, include: { items: true } })
    res.json({ data: serialize(order), message: 'Status atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

// DELETE /orders/:id — cancela apenas pedidos do próprio cliente em status "Pendente".
exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' })
    if (order.customerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado a este pedido' })
    }
    if (order.status !== 'Pendente') {
      return res.status(422).json({ error: 'Apenas pedidos pendentes podem ser cancelados' })
    }
    await prisma.$transaction([
      prisma.orderItem.deleteMany({ where: { orderId: id } }),
      prisma.order.delete({ where: { id } })
    ])
    res.json({ message: 'Pedido cancelado com sucesso' })
  } catch (err) {
    next(err)
  }
}

// GET /admin/orders — todos os pedidos [AUTH ADMIN]
exports.adminList = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const where = {}
    if (req.query.status) where.status = req.query.status
    const [items, total] = await Promise.all([
      prisma.order.findMany({ where, include: { items: true, customer: true }, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.order.count({ where })
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}
