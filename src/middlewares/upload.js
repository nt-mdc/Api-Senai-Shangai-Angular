const multer = require('multer')

// Upload de imagens em memória (Vercel é serverless — não persistir em disco).
// Regra: nullable | image/jpeg,png,webp | máx 2MB. O buffer é enviado ao Vercel
// Blob pelo service src/services/blob.js.
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) return cb(null, true)
    cb(null, false)
  }
})

module.exports = upload
