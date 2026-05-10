import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import supabaseAdmin from '../lib/supabaseAdmin.js'
import { chat } from '../services/claude.js'

const router = Router()

const DISCLAIMER = '\n\n_This is informational guidance only and does not constitute legal or financial advice._'

router.post('/message', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id
    const { message, history = [], programContext = null } = req.body

    const [{ data: profile }, { data: programs }] = await Promise.all([
      supabaseAdmin
        .from('user_profile')
        .select('full_name, state, income, household_size, employment_status, has_children')
        .eq('user_id', userId)
        .single(),
      supabaseAdmin
        .from('programs')
        .select('name, category, description_en, eligibility_rules'),
    ])

    // Include all programs inline — corpus is small enough to fit in context
    const programSummary = (programs ?? [])
      .map(p => `${p.name} (${p.category}): ${p.description_en}`)
      .join('\n')

    const systemPrompt = `You are a compassionate benefits navigator helping a user find and apply for government assistance programs.

Always:
- Speak plainly and simply
- Say "you may qualify" — never "you qualify"
- Never give legal or financial advice
- If unsure, say so

User profile:
- Name: ${profile?.full_name || 'Unknown'}
- State: ${profile?.state || 'Unknown'}
- Income: ${profile?.income || 'Unknown'}
- Household size: ${profile?.household_size || 'Unknown'}
- Employment: ${profile?.employment_status || 'Unknown'}
- Has children: ${profile?.has_children ? 'Yes' : 'No'}
${programContext ? `\nCurrent program context:\n${programContext}` : ''}

Available programs:
${programSummary}`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10),
      { role: 'user', content: message },
    ]

    const response = await chat(messages)

    // Background: detect new facts from user message
    detectAndSaveFacts(userId, message).catch(console.error)

    res.json({ response: response + DISCLAIMER })
  } catch (err) {
    next(err)
  }
})

async function detectAndSaveFacts(userId, userMessage) {
  try {
    const result = await chat([
      {
        role: 'system',
        content: 'Extract any personal facts the user revealed about themselves. Return ONLY JSON like {"field_key": "value"} or {} if nothing found. No explanation.',
      },
      { role: 'user', content: userMessage },
    ])

    const facts = JSON.parse(result.replace(/```json\n?|\n?```/g, '').trim())
    if (!facts || !Object.keys(facts).length) return

    const upserts = Object.entries(facts).map(([key, value]) => ({
      user_id: userId,
      field_key: key,
      field_value: String(value),
      source: 'chat',
    }))

    await supabaseAdmin.from('user_facts').upsert(upserts, { onConflict: 'user_id,field_key' })
  } catch {
    // Best-effort, never throw
  }
}

export default router
