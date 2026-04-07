const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../config/database')

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    const error = new Error('Credenciais inválidas')
    error.status = 401
    throw error
  }

  // If the stored password is plain text (not a bcrypt hash), hash it and update
  const isBcryptHash = user.password_hash.startsWith('$2')
  if (!isBcryptHash) {
    const hashed = await bcrypt.hash(user.password_hash, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: hashed }
    })
    user.password_hash = hashed
  }

  const isValid = await bcrypt.compare(password, user.password_hash)

  if (!isValid) {
    const error = new Error('Credenciais inválidas')
    error.status = 401
    throw error
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )

  return { token }
}

async function createAdmin(name, email, password) {
  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    const error = new Error('E-mail já cadastrado')
    error.status = 400
    throw error
  }

  const password_hash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password_hash, role: 'admin' }
  })

  return { id: user.id, name: user.name, email: user.email }
}

module.exports = { login, createAdmin }
