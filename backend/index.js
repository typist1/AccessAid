import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler.js'
import eligibilityRoutes from './routes/eligibility.js'
import chatRoutes from './routes/chat.js'
import extractRoutes from './routes/extract.js'
import embedRoutes from './routes/embed.js'
import programsRoutes from './routes/programs.js'
import accountRoutes from './routes/account.js'
import profileRoutes from './routes/profile.js'
import extensionRoutes from './routes/extension.js'
import { cleanupExpiredDocuments } from './services/cleanup.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api/eligibility', eligibilityRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/extract', extractRoutes)
app.use('/api/embed', embedRoutes)
app.use('/api/programs', programsRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/extension', extensionRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Backend running on :${PORT}`)

  // Run cleanup once on startup, then every hour
  cleanupExpiredDocuments().catch(console.error)
  setInterval(() => {
    cleanupExpiredDocuments().catch(err => console.error('Cleanup cron failed:', err.message))
  }, 60 * 60 * 1000)
})

export default app
