const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl, toInt, toDecimal, toDate } = require('../utils/http')

const FOLDER = 'pitocos-car/events'

function serialize (event, extra = {}) {
  if (!event) return event
  const { image, organizerPhoto, registrations, ...rest } = event
  return {
    ...rest,
    image_url: imageUrl(image),
    organizer_photo_url: imageUrl(organizerPhoto),
    ...extra
  }
}

// registeredCount = inscrições com status "Aprovado" (conforme spec).
function countApproved (eventId) {
  return prisma.vehicleRegistration.count({ where: { eventId, status: 'Aprovado' } })
}

// upload.fields() entrega req.files.<campo>[]; devolve o primeiro arquivo ou null.
function pickFile (req, field) {
  const files = req.files || {}
  return files[field] && files[field][0] ? files[field][0] : null
}

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const where = {}
    if (req.query.upcoming === 'true') where.eventDate = { gte: new Date() }

    const [items, total] = await Promise.all([
      prisma.carEvent.findMany({ where, orderBy: { eventDate: 'asc' }, skip, take }),
      prisma.carEvent.count({ where })
    ])
    res.json({ data: items.map((e) => serialize(e)), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const event = await prisma.carEvent.findUnique({ where: { id } })
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' })

    const registeredCount = await countApproved(id)
    res.json({
      data: serialize(event, {
        registeredCount,
        availableSlots: event.vehicleLimit - registeredCount,
        isFree: event.ticketPrice === null
      }),
      message: 'OK'
    })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { title, organizerName, organizerBio, description, ticketDescription } = req.body
    const eventDate = toDate(req.body.eventDate)
    const vehicleLimit = toInt(req.body.vehicleLimit)

    const details = []
    if (!title) details.push('O campo title é obrigatório')
    if (!organizerName) details.push('O campo organizerName é obrigatório')
    if (!organizerBio) details.push('O campo organizerBio é obrigatório')
    if (!eventDate) details.push('O campo eventDate é obrigatório e deve ser uma data válida')
    if (!description) details.push('O campo description é obrigatório')
    if (vehicleLimit === undefined) details.push('O campo vehicleLimit é obrigatório')
    if (details.length) return res.status(422).json({ error: 'Dados inválidos', details })

    const imageFile = pickFile(req, 'image')
    const photoFile = pickFile(req, 'organizerPhoto')

    const event = await prisma.carEvent.create({
      data: {
        title,
        organizerName,
        organizerBio,
        eventDate,
        description,
        vehicleLimit,
        ticketPrice: toDecimal(req.body.ticketPrice) ?? null,
        ticketDescription: ticketDescription ?? null,
        image: imageFile ? await uploadBlob(imageFile, FOLDER) : null,
        organizerPhoto: photoFile ? await uploadBlob(photoFile, FOLDER) : null
      }
    })
    res.status(201).json({ data: serialize(event), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.carEvent.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Evento não encontrado' })

    const data = {}
    if (req.body.title !== undefined) data.title = req.body.title
    if (req.body.organizerName !== undefined) data.organizerName = req.body.organizerName
    if (req.body.organizerBio !== undefined) data.organizerBio = req.body.organizerBio
    if (req.body.eventDate !== undefined) data.eventDate = toDate(req.body.eventDate)
    if (req.body.description !== undefined) data.description = req.body.description
    if (req.body.vehicleLimit !== undefined) data.vehicleLimit = toInt(req.body.vehicleLimit)
    if (req.body.ticketPrice !== undefined) data.ticketPrice = toDecimal(req.body.ticketPrice) ?? null
    if (req.body.ticketDescription !== undefined) data.ticketDescription = req.body.ticketDescription || null

    const imageFile = pickFile(req, 'image')
    if (imageFile) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(imageFile, FOLDER)
    }
    const photoFile = pickFile(req, 'organizerPhoto')
    if (photoFile) {
      await deleteBlob(existing.organizerPhoto)
      data.organizerPhoto = await uploadBlob(photoFile, FOLDER)
    }

    const event = await prisma.carEvent.update({ where: { id }, data })
    res.json({ data: serialize(event), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.carEvent.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Evento não encontrado' })
    await deleteBlob(existing.image)
    await deleteBlob(existing.organizerPhoto)
    await prisma.carEvent.delete({ where: { id } })
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}
