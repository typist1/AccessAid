import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import supabaseAdmin from '../lib/supabaseAdmin.js'

const router = Router()

const ALLOWED_FIELDS = [
  'full_name', 'age', 'state', 'zip_code', 'employment_status',
  'monthly_income_current', 'annual_income_last_year',
  'household_size', 'citizenship_status', 'has_children', 'num_children',
  'disability_status', 'pregnant', 'student_status', 'is_veteran',
  'language_preference', 'delete_docs_after_extraction',
]

router.put('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => ALLOWED_FIELDS.includes(k))
    )

    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: 'No valid fields to update' })
    }

    const { error: profileErr } = await supabaseAdmin
      .from('user_profile')
      .update(updates)
      .eq('user_id', userId)

    if (profileErr) throw profileErr

    // Mirror to user_facts so extension autofill stays in sync
    const factRows = Object.entries(updates).map(([field_key, value]) => ({
      user_id: userId,
      field_key,
      field_value: String(value),
      source: 'settings',
    }))
    const { error: factsErr } = await supabaseAdmin
      .from('user_facts')
      .upsert(factRows, { onConflict: 'user_id,field_key' })

    if (factsErr) throw factsErr

    res.json({ updated: true })
  } catch (err) {
    next(err)
  }
})

export default router
