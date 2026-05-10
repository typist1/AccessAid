import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import supabaseAdmin from '../lib/supabaseAdmin.js'
import { scoreEligibility } from '../services/eligibilityEngine.js'

const router = Router()

router.post('/score', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id

    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('*')
      .eq('user_id', userId)
      .single()

    const { data: programs } = await supabaseAdmin
      .from('programs')
      .select('*')

    const results = await Promise.all(
      programs.map(async (program) => {
        const { score, reasons, missing, notes } = await scoreEligibility(profile, program)
        return { program_id: program.id, score, reasons, missing, notes }
      })
    )

    // Fetch existing statuses — preserve in_progress/submitted/approved/denied
    const { data: existing } = await supabaseAdmin
      .from('user_programs')
      .select('program_id, status')
      .eq('user_id', userId)

    const existingStatusMap = Object.fromEntries(
      (existing ?? []).map(r => [r.program_id, r.status])
    )
    const PRESERVE_STATUSES = new Set(['in_progress', 'submitted', 'approved', 'denied'])

    const upserts = results.map(r => ({
      user_id: userId,
      program_id: r.program_id,
      eligibility_score: r.score,
      status: PRESERVE_STATUSES.has(existingStatusMap[r.program_id])
        ? existingStatusMap[r.program_id]
        : 'matched',
      missing_docs: r.missing,
      notes: r.notes,
    }))

    await supabaseAdmin.from('user_programs').upsert(upserts, {
      onConflict: 'user_id,program_id',
      ignoreDuplicates: false,
    })

    res.json({ scored: results.length })
  } catch (err) {
    next(err)
  }
})

export default router
