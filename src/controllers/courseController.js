const courseService = require('../services/courseService')

async function list(req, res, next) {
  try {
    const filters = {
      title: req.query.title,
      instructor: req.query.instructor,
      category: req.query.category
    }

    const courses = await courseService.listCourses(filters)
    return res.json(courses)
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const course = await courseService.getCourseById(req.params.id)
    return res.json(course)
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const course = await courseService.createCourse(req.body, req.user.id)
    return res.status(201).json(course)
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body)
    return res.json(course)
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    await courseService.deleteCourse(req.params.id)
    return res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getById, create, update, remove }
