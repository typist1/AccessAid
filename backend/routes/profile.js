import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import supabaseAdmin from '../lib/supabaseAdmin.js'

const router = Router()

const ALLOWED_FIELDS = [
  'full_name', 'age', 'state', 'employment_status', 'income',
  'household_size', 'citizenship_status', 'has_children',
  'children_count', 'disability_status', 'student_status',
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

    const { error } = await supabaseAdmin
      .from('user_profile')
      .update(updates)
      .eq('user_id', userId)

    if (error) throw error
    res.json({ updated: true })
  } catch (err) {
    next(err)
  }
})

export default router
