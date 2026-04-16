const prisma = require('../config/database')

async function listCourses(filters) {
  const where = {}

  if (filters.title) {
    where.title = { contains: filters.title, mode: 'insensitive' }
  }

  if (filters.instructor) {
    where.instructor = { contains: filters.instructor, mode: 'insensitive' }
  }

  if (filters.category) {
    where.category = { equals: filters.category, mode: 'insensitive' }
  }

  const courses = await prisma.course.findMany({
    where,
    orderBy: { created_at: 'desc' }
  })

  return courses
}

async function getCourseById(id) {
  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) }
  })

  if (!course) {
    const error = new Error('Curso não encontrado')
    error.status = 404
    throw error
  }

  return course
}

async function createCourse(data, userId) {
  const requiredFields = ['title', 'instructor', 'category', 'workload', 'price']
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === '') {
      const error = new Error(`Campo obrigatório ausente: ${field}`)
      error.status = 400
      throw error
    }
  }

  const workload = parseInt(data.workload)
  if (isNaN(workload) || workload < 1) {
    const error = new Error('Carga horária deve ser pelo menos 1 hora')
    error.status = 400
    throw error
  }

  const price = parseFloat(data.price)
  if (isNaN(price) || price < 0) {
    const error = new Error('Preço deve ser um valor positivo')
    error.status = 400
    throw error
  }

  const course = await prisma.course.create({
    data: {
      title: data.title,
      instructor: data.instructor,
      category: data.category,
      workload,
      price,
      description: data.description || null,
      created_by: userId
    }
  })

  return course
}

async function updateCourse(id, data) {
  const courseId = parseInt(id)

  const existing = await prisma.course.findUnique({ where: { id: courseId } })
  if (!existing) {
    const error = new Error('Curso não encontrado')
    error.status = 404
    throw error
  }

  const updateData = {}

  if (data.title !== undefined) updateData.title = data.title
  if (data.instructor !== undefined) updateData.instructor = data.instructor
  if (data.category !== undefined) updateData.category = data.category
  if (data.description !== undefined) updateData.description = data.description

  if (data.workload !== undefined) {
    const workload = parseInt(data.workload)
    if (isNaN(workload) || workload < 1) {
      const error = new Error('Carga horária deve ser pelo menos 1 hora')
      error.status = 400
      throw error
    }
    updateData.workload = workload
  }

  if (data.price !== undefined) {
    const price = parseFloat(data.price)
    if (isNaN(price) || price < 0) {
      const error = new Error('Preço deve ser um valor positivo')
      error.status = 400
      throw error
    }
    updateData.price = price
  }

  const course = await prisma.course.update({
    where: { id: courseId },
    data: updateData
  })

  return course
}

async function deleteCourse(id) {
  const courseId = parseInt(id)

  const existing = await prisma.course.findUnique({ where: { id: courseId } })
  if (!existing) {
    const error = new Error('Curso não encontrado')
    error.status = 404
    throw error
  }

  await prisma.course.delete({ where: { id: courseId } })
}

module.exports = { listCourses, getCourseById, createCourse, updateCourse, deleteCourse }
