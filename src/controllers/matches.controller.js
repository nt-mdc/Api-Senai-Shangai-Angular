const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl, toInt, toDate } = require('../utils/http')

const FOLDER = 'dentro-do-jogo/matches'

function serializeTeam (t) {
  if (!t) return t
  const { image, ...rest } = t
  return { ...rest, goalDifference: t.goalsFor - t.goalsAgainst, image_url: imageUrl(image) }
}

function serialize (match) {
  if (!match) return match
  const { image, homeTeam, awayTeam, ...rest } = match
  return {
    ...rest,
    image_url: imageUrl(image),
    homeTeam: homeTeam ? serializeTeam(homeTeam) : undefined,
    awayTeam: awayTeam ? serializeTeam(awayTeam) : undefined
  }
}

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const where = {}
    if (req.query.stage) where.stage = req.query.stage
    if (req.query.status) where.status = req.query.status
    if (req.query.teamId) {
      const teamId = parseInt(req.query.teamId)
      where.OR = [{ homeTeamId: teamId }, { awayTeamId: teamId }]
    }

    const [items, total] = await Promise.all([
      prisma.match.findMany({ where, orderBy: { matchDate: 'asc' }, skip, take }),
      prisma.match.count({ where })
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const match = await prisma.match.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { homeTeam: true, awayTeam: true }
    })
    if (!match) return res.status(404).json({ error: 'Partida não encontrada' })
    res.json({ data: serialize(match), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { stadium, city, stage } = req.body
    const homeTeamId = toInt(req.body.homeTeamId)
    const awayTeamId = toInt(req.body.awayTeamId)
    const matchDate = toDate(req.body.matchDate)

    const details = []
    if (homeTeamId === undefined) details.push('O campo homeTeamId é obrigatório')
    if (awayTeamId === undefined) details.push('O campo awayTeamId é obrigatório')
    if (!matchDate) details.push('O campo matchDate é obrigatório e deve ser uma data válida')
    if (!stadium) details.push('O campo stadium é obrigatório')
    if (!city) details.push('O campo city é obrigatório')
    if (!stage) details.push('O campo stage é obrigatório')
    if (details.length) return res.status(422).json({ error: 'Dados inválidos', details })

    let image = null
    if (req.file) image = await uploadBlob(req.file, FOLDER)

    const match = await prisma.match.create({
      data: {
        homeTeamId,
        awayTeamId,
        homeScore: toInt(req.body.homeScore) ?? null,
        awayScore: toInt(req.body.awayScore) ?? null,
        matchDate,
        stadium,
        city,
        stage,
        status: req.body.status || undefined,
        image
      },
      include: { homeTeam: true, awayTeam: true }
    })
    res.status(201).json({ data: serialize(match), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.match.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Partida não encontrada' })

    const data = {}
    if (req.body.homeTeamId !== undefined) data.homeTeamId = toInt(req.body.homeTeamId)
    if (req.body.awayTeamId !== undefined) data.awayTeamId = toInt(req.body.awayTeamId)
    if (req.body.homeScore !== undefined) data.homeScore = toInt(req.body.homeScore) ?? null
    if (req.body.awayScore !== undefined) data.awayScore = toInt(req.body.awayScore) ?? null
    if (req.body.matchDate !== undefined) data.matchDate = toDate(req.body.matchDate)
    if (req.body.stadium !== undefined) data.stadium = req.body.stadium
    if (req.body.city !== undefined) data.city = req.body.city
    if (req.body.stage !== undefined) data.stage = req.body.stage
    if (req.body.status !== undefined) data.status = req.body.status
    if (req.file) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(req.file, FOLDER)
    }

    const match = await prisma.match.update({
      where: { id },
      data,
      include: { homeTeam: true, awayTeam: true }
    })
    res.json({ data: serialize(match), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.match.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Partida não encontrada' })
    await deleteBlob(existing.image)
    await prisma.match.delete({ where: { id } })
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}
