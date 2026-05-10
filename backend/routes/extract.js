import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import supabaseAdmin from '../lib/supabaseAdmin.js'
import { extractFacts } from '../services/factExtractor.js'

const router = Router()

router.post('/facts', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id
    const { ocrText, documentType, documentId } = req.body

    if (!ocrText || !documentType) {
      return res.status(400).json({ error: 'ocrText and documentType required' })
    }

    const facts = await extractFacts(ocrText, documentType)

    // Update document extraction status
    await supabaseAdmin.from('documents')
      .update({
        extraction_status: 'completed',
        extracted_text: ocrText,
        fields_extracted: Object.keys(facts).length,
      })
      .eq('id', documentId)

    res.json({ facts })
  } catch (err) {
    next(err)
  }
})

// Called after user confirms facts on ExtractionReview screen
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
