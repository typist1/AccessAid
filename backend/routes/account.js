import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import supabaseAdmin from '../lib/supabaseAdmin.js'

const router = Router()

router.delete('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id

    // Delete all storage files for this user
    const { data: docs } = await supabaseAdmin
      .from('documents')
      .select('file_url')
      .eq('user_id', userId)
      .not('file_url', 'is', null)

    if (docs?.length) {
      await supabaseAdmin.storage.from('documents')
        .remove(docs.map(d => d.file_url))
    }

    // Delete auth user (cascades to all tables via FK on delete cascade)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (error) throw error

    res.json({ deleted: true })
  } catch (err) {
    next(err)
  }
})

export default router
