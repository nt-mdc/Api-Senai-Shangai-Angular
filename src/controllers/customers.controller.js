const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl } = require('../utils/http')

const FOLDER = 'nexus/customers'

// Nunca expor a senha. Renomeia image → image_url.
function serialize (c) {
  if (!c) return c
  const { password, image, ...rest } = c
  return { ...rest, image_url: imageUrl(image) }
}

function signToken (customer) {
  return jwt.sign(
    { id: customer.id, email: customer.email, role: customer.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body
    const details = []
    if (!name) details.push('O campo name é obrigatório')
    if (!email) details.push('O campo email é obrigatório')
    if (!password) details.push('O campo password é obrigatório')
    if (details.length) return res.status(422).json({ error: 'Dados inválidos', details })

    const exists = await prisma.customer.findUnique({ where: { email } })
    if (exists) return res.status(422).json({ error: 'E-mail já cadastrado' })

    let image = null
    if (req.file) image = await uploadBlob(req.file, FOLDER)

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        phone: phone ?? null,
        address: address ?? null,
        image
      }
    })
    res.status(201).json({ data: serialize(customer), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(422).json({ error: 'E-mail e senha são obrigatórios' })
    }

    const customer = await prisma.customer.findUnique({ where: { email } })
    if (!customer || !(await bcrypt.compare(password, customer.password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    res.json({ data: { token: signToken(customer), customer: serialize(customer) }, message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.me = async (req, res, next) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { id: req.user.id } })
    if (!customer) return res.status(404).json({ error: 'Cliente não encontrado' })
    res.json({ data: serialize(customer), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.updateMe = async (req, res, next) => {
  try {
    const existing = await prisma.customer.findUnique({ where: { id: req.user.id } })
    if (!existing) return res.status(404).json({ error: 'Cliente não encontrado' })

    const data = {}
    if (req.body.name !== undefined) data.name = req.body.name
    if (req.body.phone !== undefined) data.phone = req.body.phone || null
    if (req.body.address !== undefined) data.address = req.body.address || null
    if (req.body.email !== undefined && req.body.email !== existing.email) {
      const clash = await prisma.customer.findUnique({ where: { email: req.body.email } })
      if (clash) return res.status(422).json({ error: 'E-mail já cadastrado' })
      data.email = req.body.email
    }
    if (req.body.password) data.password = await bcrypt.hash(req.body.password, 10)
    if (req.file) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(req.file, FOLDER)
    }

    const customer = await prisma.customer.update({ where: { id: req.user.id }, data })
    res.json({ data: serialize(customer), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.deleteMe = async (req, res, next) => {
  try {
    const existing = await prisma.customer.findUnique({ where: { id: req.user.id } })
    if (!existing) return res.status(404).json({ error: 'Cliente não encontrado' })
    await deleteBlob(existing.image)
    await prisma.customer.delete({ where: { id: req.user.id } })
    res.json({ message: 'Conta removida com sucesso' })
  } catch (err) {
    next(err)
  }
}

// ─── Admin ───────────────────────────────────────────────────────────────────

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const [items, total] = await Promise.all([
      prisma.customer.findMany({ orderBy: { name: 'asc' }, skip, take }),
      prisma.customer.count()
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!customer) return res.status(404).json({ error: 'Cliente não encontrado' })
    res.json({ data: serialize(customer), message: 'OK' })
  } catch (err) {
    next(err)
  }
}
