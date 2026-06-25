// Helpers compartilhados pelos controllers dos projetos novos.

// Lê ?page= e ?perPage= (default 15) e devolve os parâmetros do Prisma.
function getPagination (req) {
  const page = Math.max(parseInt(req.query.page) || 1, 1)
  const perPage = Math.max(parseInt(req.query.perPage) || 15, 1)
  return { page, perPage, skip: (page - 1) * perPage, take: perPage }
}

// Monta o objeto `meta` padrão de paginação.
function paginationMeta (page, perPage, total) {
  return { page, perPage, total, totalPages: Math.ceil(total / perPage) }
}

// No Vercel Blob a coluna `image` já guarda a URL pública completa.
function imageUrl (value) {
  return value || null
}

// Parsers tolerantes para campos vindos de multipart/form-data (sempre strings).
// Retornam `undefined` quando o campo não foi enviado — assim o Prisma aplica o
// default (no create) ou simplesmente não altera o campo (no update parcial).
function toInt (value) {
  if (value === undefined || value === null || value === '') return undefined
  const n = parseInt(value)
  return Number.isNaN(n) ? undefined : n
}

function toDecimal (value) {
  if (value === undefined || value === null || value === '') return undefined
  const n = Number(value)
  return Number.isNaN(n) ? undefined : n
}

function toDate (value) {
  if (value === undefined || value === null || value === '') return undefined
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d
}

module.exports = { getPagination, paginationMeta, imageUrl, toInt, toDecimal, toDate }
