import { Router } from 'express'
import supabaseAdmin from '../lib/supabaseAdmin.js'

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

export default router
