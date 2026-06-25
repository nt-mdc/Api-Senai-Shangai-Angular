const { put, del } = require('@vercel/blob')
const slugify = require('slugify')

// Service reutilizável de upload de imagens sobre o Vercel Blob.
// `put` já devolve a URL pública completa — é ela que gravamos na coluna `image`
// e devolvemos como `image_url` nas respostas.

// uploadBlob(file, folder) → envia o buffer e retorna a URL pública.
async function uploadBlob (file, folder) {
  const ext = (file.originalname.match(/\.[^.]+$/) || [''])[0]
  const base = slugify(file.originalname.replace(/\.[^.]+$/, ''), { lower: true, strict: true }) || 'file'
  const pathname = `${folder}/${Date.now()}-${base}${ext}`
  const blob = await put(pathname, file.buffer, {
    access: 'public',
    contentType: file.mimetype
  })
  return blob.url
}

// deleteBlob(url) → remove o arquivo do storage (silencioso se já não existir).
async function deleteBlob (url) {
  if (!url) return
  await del(url).catch(() => {})
}

module.exports = { uploadBlob, deleteBlob }
