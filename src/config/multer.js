const multer = require('multer')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 5 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg']
    cb(null, allowed.includes(file.mimetype))
  }
})

module.exports = upload
