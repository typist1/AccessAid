export function errorHandler(err, req, res, next) {
  const status = err.status ?? err.statusCode ?? 500
  const message = err.message ?? 'Internal server error'

  if (status === 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${message}`)
    console.error(err.stack)
  }

  res.status(status).json({ error: message })
}
