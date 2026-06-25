const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl, toInt } = require('../utils/http')

const FOLDER = 'dentro-do-jogo/teams'

function serialize (team) {
  if (!team) return team
  const { image, ...rest } = team
  return { ...rest, goalDifference: team.goalsFor - team.goalsAgainst, image_url: imageUrl(image) }
}

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const where = {}
    if (req.query.groupId) where.groupId = parseInt(req.query.groupId)

    const [items, total] = await Promise.all([
      prisma.team.findMany({ where, orderBy: [{ points: 'desc' }, { name: 'asc' }], skip, take }),
      prisma.team.count({ where })
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const team = await prisma.team.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!team) return res.status(404).json({ error: 'Seleção não encontrada' })
    res.json({ data: serialize(team), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { name, countryCode, groupId } = req.body
    const details = []
    if (!name) details.push('O campo name é obrigatório')
    if (!countryCode) details.push('O campo countryCode é obrigatório')
    if (toInt(groupId) === undefined) details.push('O campo groupId é obrigatório')
    if (details.length) return res.status(422).json({ error: 'Dados inválidos', details })

    let image = null
    if (req.file) image = await uploadBlob(req.file, FOLDER)

    const team = await prisma.team.create({
      data: {
        name,
        countryCode,
        groupId: toInt(groupId),
        wins: toInt(req.body.wins),
        losses: toInt(req.body.losses),
        draws: toInt(req.body.draws),
        points: toInt(req.body.points),
        goalsFor: toInt(req.body.goalsFor),
        goalsAgainst: toInt(req.body.goalsAgainst),
        image
      }
    })
    res.status(201).json({ data: serialize(team), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.team.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Seleção não encontrada' })

    const { name, countryCode, groupId } = req.body
    const data = {}
    if (name !== undefined) data.name = name
    if (countryCode !== undefined) data.countryCode = countryCode
    if (groupId !== undefined) data.groupId = toInt(groupId)
    if (req.body.wins !== undefined) data.wins = toInt(req.body.wins)
    if (req.body.losses !== undefined) data.losses = toInt(req.body.losses)
    if (req.body.draws !== undefined) data.draws = toInt(req.body.draws)
    if (req.body.points !== undefined) data.points = toInt(req.body.points)
    if (req.body.goalsFor !== undefined) data.goalsFor = toInt(req.body.goalsFor)
    if (req.body.goalsAgainst !== undefined) data.goalsAgainst = toInt(req.body.goalsAgainst)
    if (req.file) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(req.file, FOLDER)
    }

    const team = await prisma.team.update({ where: { id }, data })
    res.json({ data: serialize(team), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.team.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Seleção não encontrada' })
    await deleteBlob(existing.image)
    await prisma.team.delete({ where: { id } })
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}
