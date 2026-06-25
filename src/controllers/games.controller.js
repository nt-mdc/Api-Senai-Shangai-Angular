const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl, toInt } = require('../utils/http')

const FOLDER = 'maxblock/games'
const AGE_RATINGS = ['Livre', '10+', '12+', '14+', '16+', '18+']

function serialize (g) {
  if (!g) return g
  const { image, category, ...rest } = g
  const out = { ...rest, image_url: imageUrl(image) }
  if (category) out.category = { ...category, image_url: imageUrl(category.image) }
  return out
}

function isValidUrl (value) {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

// Em ambiente Vercel o IP real chega em x-forwarded-for.
function userIdentifier (req) {
  const fwd = req.headers['x-forwarded-for']
  if (fwd) return String(fwd).split(',')[0].trim()
  return req.ip
}

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const where = {}
    if (req.query.categoryId) where.categoryId = parseInt(req.query.categoryId)
    if (req.query.ageRating) where.ageRating = req.query.ageRating
    if (req.query.search) where.name = { contains: req.query.search, mode: 'insensitive' }

    const orderBy = req.query.sort === 'likes' ? { likesCount: 'desc' } : { createdAt: 'desc' }

    const [items, total] = await Promise.all([
      prisma.game.findMany({ where, include: { category: true }, orderBy, skip, take }),
      prisma.game.count({ where })
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const game = await prisma.game.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true }
    })
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado' })
    res.json({ data: serialize(game), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { name, description, ageRating, controls, gameUrl } = req.body
    const categoryId = toInt(req.body.categoryId)

    const details = []
    if (!name) details.push('O campo name é obrigatório')
    if (!description) details.push('O campo description é obrigatório')
    if (categoryId === undefined) details.push('O campo categoryId é obrigatório')
    if (!ageRating) details.push('O campo ageRating é obrigatório')
    else if (!AGE_RATINGS.includes(ageRating)) details.push(`ageRating deve ser um de: ${AGE_RATINGS.join(', ')}`)
    if (!controls) details.push('O campo controls é obrigatório')
    if (!gameUrl) details.push('O campo gameUrl é obrigatório')
    else if (!isValidUrl(gameUrl)) details.push('gameUrl deve ser uma URL válida (http/https)')
    if (details.length) return res.status(422).json({ error: 'Dados inválidos', details })

    let image = null
    if (req.file) image = await uploadBlob(req.file, FOLDER)

    const game = await prisma.game.create({
      data: { name, description, categoryId, ageRating, controls, gameUrl, image }
    })
    res.status(201).json({ data: serialize(game), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.game.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Jogo não encontrado' })

    const data = {}
    if (req.body.name !== undefined) data.name = req.body.name
    if (req.body.description !== undefined) data.description = req.body.description
    if (req.body.categoryId !== undefined) data.categoryId = toInt(req.body.categoryId)
    if (req.body.controls !== undefined) data.controls = req.body.controls
    if (req.body.ageRating !== undefined) {
      if (!AGE_RATINGS.includes(req.body.ageRating)) {
        return res.status(422).json({ error: 'ageRating inválido', details: AGE_RATINGS })
      }
      data.ageRating = req.body.ageRating
    }
    if (req.body.gameUrl !== undefined) {
      if (!isValidUrl(req.body.gameUrl)) {
        return res.status(422).json({ error: 'gameUrl deve ser uma URL válida (http/https)' })
      }
      data.gameUrl = req.body.gameUrl
    }
    if (req.file) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(req.file, FOLDER)
    }

    const game = await prisma.game.update({ where: { id }, data, include: { category: true } })
    res.json({ data: serialize(game), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.game.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Jogo não encontrado' })
    await deleteBlob(existing.image)
    await prisma.$transaction([
      prisma.gameLike.deleteMany({ where: { gameId: id } }),
      prisma.game.delete({ where: { id } })
    ])
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}

// POST /games/:id/like — curtir (público, dedup por IP).
exports.like = async (req, res, next) => {
  try {
    const gameId = parseInt(req.params.id)
    const game = await prisma.game.findUnique({ where: { id: gameId } })
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado' })

    const identifier = userIdentifier(req)
    const existing = await prisma.gameLike.findUnique({
      where: { gameId_userIdentifier: { gameId, userIdentifier: identifier } }
    })
    if (existing) return res.status(409).json({ error: 'Você já curtiu este jogo' })

    const [, updated] = await prisma.$transaction([
      prisma.gameLike.create({ data: { gameId, userIdentifier: identifier } }),
      prisma.game.update({ where: { id: gameId }, data: { likesCount: { increment: 1 } } })
    ])
    res.status(201).json({ data: { gameId, likesCount: updated.likesCount }, message: 'Curtida registrada' })
  } catch (err) {
    next(err)
  }
}

// DELETE /games/:id/like — descurtir (público).
exports.unlike = async (req, res, next) => {
  try {
    const gameId = parseInt(req.params.id)
    const game = await prisma.game.findUnique({ where: { id: gameId } })
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado' })

    const identifier = userIdentifier(req)
    const existing = await prisma.gameLike.findUnique({
      where: { gameId_userIdentifier: { gameId, userIdentifier: identifier } }
    })
    if (!existing) return res.status(404).json({ error: 'Curtida não encontrada' })

    const ops = [
      prisma.gameLike.delete({ where: { gameId_userIdentifier: { gameId, userIdentifier: identifier } } })
    ]
    // Mantém likesCount >= 0.
    if (game.likesCount > 0) {
      ops.push(prisma.game.update({ where: { id: gameId }, data: { likesCount: { decrement: 1 } } }))
    }
    const result = await prisma.$transaction(ops)
    const likesCount = game.likesCount > 0 ? result[1].likesCount : game.likesCount
    res.json({ data: { gameId, likesCount }, message: 'Curtida removida' })
  } catch (err) {
    next(err)
  }
}

// GET /games/:id/likes/count — total de curtidas.
exports.likesCount = async (req, res, next) => {
  try {
    const gameId = parseInt(req.params.id)
    const game = await prisma.game.findUnique({ where: { id: gameId } })
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado' })
    const total = await prisma.gameLike.count({ where: { gameId } })
    res.json({ data: { gameId, likesCount: game.likesCount, total }, message: 'OK' })
  } catch (err) {
    next(err)
  }
}
