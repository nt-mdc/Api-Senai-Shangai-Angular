const prisma = require('../config/database')
const { uploadBlob, deleteBlob } = require('../services/blob')
const { getPagination, paginationMeta, imageUrl } = require('../utils/http')

const FOLDER = 'lumiere/sizes'

function serialize (s) {
  if (!s) return s
  const { image, ...rest } = s
  return { ...rest, image_url: imageUrl(image) }
}

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, skip, take } = getPagination(req)
    const [items, total] = await Promise.all([
      prisma.clothingSize.findMany({ orderBy: { label: 'asc' }, skip, take }),
      prisma.clothingSize.count()
    ])
    res.json({ data: items.map(serialize), meta: paginationMeta(page, perPage, total) })
  } catch (err) {
    next(err)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const size = await prisma.clothingSize.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!size) return res.status(404).json({ error: 'Tamanho não encontrado' })
    res.json({ data: serialize(size), message: 'OK' })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { label } = req.body
    if (!label) return res.status(422).json({ error: 'Dados inválidos', details: ['O campo label é obrigatório'] })

    const exists = await prisma.clothingSize.findUnique({ where: { label } })
    if (exists) return res.status(422).json({ error: 'Já existe um tamanho com este label' })

    let image = null
    if (req.file) image = await uploadBlob(req.file, FOLDER)

    const size = await prisma.clothingSize.create({ data: { label, image } })
    res.status(201).json({ data: serialize(size), message: 'Criado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.clothingSize.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Tamanho não encontrado' })

    const data = {}
    if (req.body.label !== undefined && req.body.label !== existing.label) {
      const clash = await prisma.clothingSize.findUnique({ where: { label: req.body.label } })
      if (clash) return res.status(422).json({ error: 'Já existe um tamanho com este label' })
      data.label = req.body.label
    }
    if (req.file) {
      await deleteBlob(existing.image)
      data.image = await uploadBlob(req.file, FOLDER)
    }

    const size = await prisma.clothingSize.update({ where: { id }, data })
    res.json({ data: serialize(size), message: 'Atualizado com sucesso' })
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const existing = await prisma.clothingSize.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Tamanho não encontrado' })
    await deleteBlob(existing.image)
    await prisma.clothingSize.delete({ where: { id } })
    res.json({ message: 'Removido com sucesso' })
  } catch (err) {
    next(err)
  }
}
