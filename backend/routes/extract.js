import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import supabaseAdmin from '../lib/supabaseAdmin.js'
import { extractFacts } from '../services/factExtractor.js'

const router = Router()

// Accepts either { ocrText } (legacy) or { fileBase64, mimeType } (Claude vision)
router.post('/facts', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id
    const { ocrText, fileBase64, mimeType, documentType, documentId } = req.body

    if (!documentType) return res.status(400).json({ error: 'documentType required' })
    if (!ocrText && !fileBase64) return res.status(400).json({ error: 'ocrText or fileBase64 required' })

    const input = fileBase64 ? { fileBase64, mimeType: mimeType || 'image/jpeg' } : ocrText
    const facts = await extractFacts(input, documentType)

    if (documentId) {
      await supabaseAdmin.from('documents').update({
        extraction_status: 'completed',
        ...(ocrText && { extracted_text: ocrText }),
        fields_extracted: Object.keys(facts).length,
      }).eq('id', documentId)
    }

    res.json({ facts })
  } catch (err) {
    next(err)
  }
})

router.post('/confirm', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id
    const { facts, documentType } = req.body

    const upserts = Object.entries(facts).map(([key, value]) => ({
      user_id: userId,
      field_key: key,
      field_value: String(value),
      source: documentType,
    }))

    await supabaseAdmin.from('user_facts').upsert(upserts, { onConflict: 'user_id,field_key' })
    res.json({ saved: upserts.length })
  } catch (err) {
    next(err)
  }
})

export default router
