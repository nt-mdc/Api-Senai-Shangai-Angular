const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl } = require('../utils/http')

const FOLDER = 'dentro-do-jogo/groups'

function serializeTeam (t) {
  const { image, ...rest } = t
  return { ...rest, goalDifference: t.goalsFor - t.goalsAgainst, image_url: imageUrl(image) }
}

function serialize (group) {
  if (!group) return group
  const { image, teams, ...rest } = group
  return {
    ...rest,
    image_url: imageUrl(image),
    teams: Array.isArray(teams) ? teams.map(serializeTeam) : undefined
  }
}

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const [items, total] = await Promise.all([
      prisma.group.findMany({ include: { teams: true }, orderBy: { name: 'asc' }, skip, take }),
      prisma.group.count()
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const group = await prisma.group.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { teams: { orderBy: [{ points: 'desc' }, { name: 'asc' }] } }
    })
    if (!group) return res.status(404).json({ error: 'Grupo não encontrado' })
    res.json({ data: serialize(group), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { name, description } = req.body
    if (!name) {
      return res.status(422).json({ error: 'Dados inválidos', details: ['O campo name é obrigatório'] })
    }

    let image = null
    if (req.file) image = await uploadBlob(req.file, FOLDER)

    const group = await prisma.group.create({
      data: { name, description: description ?? null, image },
      include: { teams: true }
    })
    res.status(201).json({ data: serialize(group), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.group.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Grupo não encontrado' })

    const { name, description } = req.body
    const data = {}
    if (name !== undefined) data.name = name
    if (description !== undefined) data.description = description || null
    if (req.file) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(req.file, FOLDER)
    }

    const group = await prisma.group.update({ where: { id }, data, include: { teams: true } })
    res.json({ data: serialize(group), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.group.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Grupo não encontrado' })
    await deleteBlob(existing.image)
    await prisma.group.delete({ where: { id } })
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}
