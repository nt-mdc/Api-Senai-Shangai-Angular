require('dotenv').config()
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const routes = require('./routes')
const swaggerSpec = require('./config/swagger')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'API SENAI — Documentação',
  swaggerOptions: { persistAuthorization: true }
}))
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec))

app.use('/api', routes)

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Internal server error' })
})

module.exports = app
