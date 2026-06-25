const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl, toInt } = require('../utils/http')

const FOLDER = 'pitocos-car/registrations'
const STATUSES = ['Pendente', 'Aprovado', 'Rejeitado']

function serialize (reg) {
  if (!reg) return reg
  const { image, ...rest } = reg
  return { ...rest, image_url: imageUrl(image) }
}

exports.list = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId)
    const { page, perPage, skip, take } = getPagination(req)
    const where = { eventId }
    if (req.query.status) where.status = req.query.status

    const [items, total] = await Promise.all([
      prisma.vehicleRegistration.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.vehicleRegistration.count({ where })
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const reg = await prisma.vehicleRegistration.findFirst({
      where: { id: parseInt(req.params.id), eventId: parseInt(req.params.eventId) }
    })
    if (!reg) return res.status(404).json({ error: 'Inscrição não encontrada' })
    res.json({ data: serialize(reg), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId)
    const event = await prisma.carEvent.findUnique({ where: { id: eventId } })
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' })

    const { ownerName, ownerEmail, vehicleName, vehicleDescription } = req.body
    const vehicleYear = toInt(req.body.vehicleYear)

    const details = []
    if (!ownerName) details.push('O campo ownerName é obrigatório')
    if (!ownerEmail) details.push('O campo ownerEmail é obrigatório')
    if (!vehicleName) details.push('O campo vehicleName é obrigatório')
    if (vehicleYear === undefined) details.push('O campo vehicleYear é obrigatório')
    if (!vehicleDescription) details.push('O campo vehicleDescription é obrigatório')
    if (details.length) return res.status(422).json({ error: 'Dados inválidos', details })

    const registeredCount = await prisma.vehicleRegistration.count({
      where: { eventId, status: 'Aprovado' }
    })
    if (registeredCount >= event.vehicleLimit) {
      return res.status(422).json({ error: 'Este evento já atingiu o limite de veículos' })
    }

    let image = null
    if (req.file) image = await uploadBlob(req.file, FOLDER)

    const reg = await prisma.vehicleRegistration.create({
      data: { eventId, ownerName, ownerEmail, vehicleName, vehicleYear, vehicleDescription, image }
    })
    res.status(201).json({ data: serialize(reg), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const existing = await prisma.vehicleRegistration.findFirst({
      where: { id: parseInt(req.params.id), eventId: parseInt(req.params.eventId) }
    })
    if (!existing) return res.status(404).json({ error: 'Inscrição não encontrada' })

    const data = {}
    if (req.body.ownerName !== undefined) data.ownerName = req.body.ownerName
    if (req.body.ownerEmail !== undefined) data.ownerEmail = req.body.ownerEmail
    if (req.body.vehicleName !== undefined) data.vehicleName = req.body.vehicleName
    if (req.body.vehicleYear !== undefined) data.vehicleYear = toInt(req.body.vehicleYear)
    if (req.body.vehicleDescription !== undefined) data.vehicleDescription = req.body.vehicleDescription
    if (req.body.status !== undefined) {
      if (!STATUSES.includes(req.body.status)) {
        return res.status(422).json({ error: 'Status inválido', details: STATUSES })
      }
      data.status = req.body.status
    }
    if (req.file) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(req.file, FOLDER)
    }

    const reg = await prisma.vehicleRegistration.update({ where: { id: existing.id }, data })
    res.json({ data: serialize(reg), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

// PATCH .../:id/status — aceita apenas { status }.
exports.updateStatus = async (req, res, next) => {
  try {
    const existing = await prisma.vehicleRegistration.findFirst({
      where: { id: parseInt(req.params.id), eventId: parseInt(req.params.eventId) }
    })
    if (!existing) return res.status(404).json({ error: 'Inscrição não encontrada' })

    const { status } = req.body
    if (!status || !STATUSES.includes(status)) {
      return res.status(422).json({ error: 'Status inválido', details: STATUSES })
    }

    const reg = await prisma.vehicleRegistration.update({ where: { id: existing.id }, data: { status } })
    res.json({ data: serialize(reg), message: 'Status atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const existing = await prisma.vehicleRegistration.findFirst({
      where: { id: parseInt(req.params.id), eventId: parseInt(req.params.eventId) }
    })
    if (!existing) return res.status(404).json({ error: 'Inscrição não encontrada' })
    await deleteBlob(existing.image)
    await prisma.vehicleRegistration.delete({ where: { id: existing.id } })
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}
