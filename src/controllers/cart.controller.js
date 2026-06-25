const prisma = require('../config/database')
const { imageUrl, toInt } = require('../utils/http')

function serializeProduct (p) {
  if (!p) return p
  const { image, ...rest } = p
  return { ...rest, image_url: imageUrl(image), lowStock: p.stockQuantity <= p.lowStockThreshold }
}

function serializeItem (it) {
  const { image, product, ...rest } = it
  const lineTotal = product ? Number(product.price) * it.quantity : undefined
  return { ...rest, image_url: imageUrl(image), product: serializeProduct(product), lineTotal }
}

exports.list = async (req, res, next) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { customerId: req.user.id },
      include: { product: true },
      orderBy: { id: 'asc' }
    })
    const serialized = items.map(serializeItem)
    const total = serialized.reduce((sum, it) => sum + (it.lineTotal || 0), 0)
    res.json({ data: serialized, meta: { itemsCount: serialized.length, total }, message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.add = async (req, res, next) => {
  try {
    const customerId = req.user.id
    const productId = toInt(req.body.productId)
    const quantity = toInt(req.body.quantity) ?? 1

    if (productId === undefined) {
      return res.status(422).json({ error: 'Dados inválidos', details: ['O campo productId é obrigatório'] })
    }
    if (quantity < 1) {
      return res.status(422).json({ error: 'A quantidade deve ser no mínimo 1' })
    }

    const product = await prisma.electronicProduct.findUnique({ where: { id: productId } })
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' })

    const item = await prisma.cartItem.upsert({
      where: { customerId_productId: { customerId, productId } },
      update: { quantity: { increment: quantity } },
      create: { customerId, productId, quantity },
      include: { product: true }
    })
    res.status(201).json({ data: serializeItem(item), message: 'Item adicionado ao carrinho' })
  } catch (err) {
    next(err)
  }
}

exports.updateQuantity = async (req, res, next) => {
  try {
    const customerId = req.user.id
    const productId = parseInt(req.params.productId)
    const quantity = toInt(req.body.quantity)

    if (quantity === undefined || quantity < 1) {
      return res.status(422).json({ error: 'A quantidade deve ser no mínimo 1' })
    }

    const existing = await prisma.cartItem.findUnique({ where: { customerId_productId: { customerId, productId } } })
    if (!existing) return res.status(404).json({ error: 'Item não encontrado no carrinho' })

    const item = await prisma.cartItem.update({
      where: { customerId_productId: { customerId, productId } },
      data: { quantity },
      include: { product: true }
    })
    res.json({ data: serializeItem(item), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const customerId = req.user.id
    const productId = parseInt(req.params.productId)
    const existing = await prisma.cartItem.findUnique({ where: { customerId_productId: { customerId, productId } } })
    if (!existing) return res.status(404).json({ error: 'Item não encontrado no carrinho' })
    await prisma.cartItem.delete({ where: { customerId_productId: { customerId, productId } } })
    res.json({ message: 'Item removido do carrinho' })
  } catch (err) {
    next(err)
  }
}

exports.clear = async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({ where: { customerId: req.user.id } })
    res.json({ message: 'Carrinho esvaziado com sucesso' })
  } catch (err) {
    next(err)
  }
}
