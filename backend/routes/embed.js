import { Router } from 'express'
import supabaseAdmin from '../lib/supabaseAdmin.js'
import { embed } from '../services/qwen.js'

const router = Router()

// POST /api/embed/all — run once to index all programs
router.post('/all', async (req, res, next) => {
  try {
    const { data: programs } = await supabaseAdmin.from('programs').select('*')

    let count = 0
    for (const program of programs) {
      const text = `Program: ${program.name}
Category: ${program.category}
Description: ${program.description_en}
Eligibility: ${JSON.stringify(program.eligibility_rules)}
Required documents: ${(program.required_documents || []).join(', ')}`

      const vector = await embed(text)

      await supabaseAdmin.from('embeddings').upsert({
        source_type: 'program',
        source_id: program.id,
        content_chunk: text,
        embedding: vector,
      }, { onConflict: 'source_type,source_id' })

      count++
    }

    res.json({ embedded: count })
  } catch (err) {
    next(err)
  }
})

export default router
