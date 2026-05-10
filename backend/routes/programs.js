import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import supabaseAdmin from '../lib/supabaseAdmin.js'
import { chat } from '../services/claude.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('programs')
      .select('id, name, category, description_en, application_url, deadline, required_documents')
      .order('name')

    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
})

// GET /api/programs/:id/description?lang=es
router.get('/:id/description', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const lang = req.query.lang ?? 'en'

    if (lang === 'en') {
      const { data: prog } = await supabaseAdmin
        .from('programs')
        .select('name, description_en')
        .eq('id', id)
        .single()
      return res.json({ name: prog?.name, description: prog?.description_en })
    }

    // Check cache
    const { data: cached } = await supabaseAdmin
      .from('program_translations')
      .select('translated_name, translated_description')
      .eq('program_id', id)
      .eq('language', lang)
      .single()

    if (cached) {
      return res.json({ name: cached.translated_name, description: cached.translated_description })
    }

    // Fetch English source
    const { data: prog } = await supabaseAdmin
      .from('programs')
      .select('name, description_en')
      .eq('id', id)
      .single()

    if (!prog) return res.status(404).json({ error: 'Program not found' })

    // Translate with Claude
    const langName = lang === 'es' ? 'Spanish' : lang
    const raw = await chat([
      {
        role: 'system',
        content: `Translate the following program name and description to ${langName}. Return ONLY valid JSON with keys "name" and "description". No explanation.`,
      },
      {
        role: 'user',
        content: JSON.stringify({ name: prog.name, description: prog.description_en }),
      },
    ])

    let translated
    try {
      translated = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim())
    } catch {
      return res.json({ name: prog.name, description: prog.description_en })
    }

    // Cache result
    await supabaseAdmin.from('program_translations').upsert({
      program_id: id,
      language: lang,
      translated_name: translated.name,
      translated_description: translated.description,
    }, { onConflict: 'program_id,language' })

    res.json({ name: translated.name, description: translated.description })
  } catch (err) {
    next(err)
  }
})

export default router
