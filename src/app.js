require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const swaggerSpec = require('./config/swagger')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Swagger UI servido via CDN (compatível com serverless/Vercel — sem dependência de assets em disco)
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec))
app.get('/api/docs', (req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>API SENAI — Documentação</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
    <link rel="icon" type="image/png" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/favicon-32x32.png" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/api/docs.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset.slice(1)],
          layout: 'BaseLayout',
          persistAuthorization: true
        });
      };
    </script>
  </body>
</html>`)
})

app.use('/api', routes)

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Internal server error' })
})

module.exports = app
