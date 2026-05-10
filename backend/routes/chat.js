import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import supabaseAdmin from '../lib/supabaseAdmin.js'
import { chat } from '../services/claude.js'

const router = Router()

const NAV_PATTERN = /\[NAVIGATE:([^\]]+)\]/

// Pages the assistant can navigate to
const VALID_PATHS = ['/dashboard', '/programs', '/documents', '/settings']

router.post('/message', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id
    const { message, history = [], programContext = null, detectedLanguage = null } = req.body

    const [{ data: profile }, { data: programs }] = await Promise.all([
      supabaseAdmin
        .from('user_profile')
        .select('full_name, state, income, household_size, employment_status, has_children, language_preference')
        .eq('user_id', userId)
        .single(),
      supabaseAdmin
        .from('programs')
        .select('name, category, description_en, eligibility_rules'),
    ])

    const programSummary = (programs ?? [])
      .map(p => `${p.name} (${p.category}): ${p.description_en}`)
      .join('\n')

    const systemPrompt = `You are a compassionate benefits navigator helping a user find and apply for government assistance programs.

Always:
- Speak plainly and simply
- Say "you may qualify" — never "you qualify"
- Never give legal or financial advice
- If unsure, say so
- Detect the language the user is writing in and ALWAYS respond in that same language.
- Use markdown formatting: **bold** for key terms, bullet lists for steps or options, headers for sections when helpful.

Navigation: If the user asks to go to a specific section of the app, append [NAVIGATE:/path] at the very end of your response (after the main text). Valid paths: /dashboard, /programs, /documents, /settings. Only include this if the user clearly wants to navigate somewhere.

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

    const raw = await chat(messages)

    // Extract navigation intent
    const navMatch = raw.match(NAV_PATTERN)
    let navigateTo = null
    let response = raw

    if (navMatch) {
      const path = navMatch[1]
      if (VALID_PATHS.includes(path)) navigateTo = path
      // Strip the [NAVIGATE:...] token from display text
      response = raw.replace(NAV_PATTERN, '').trim()
    }

    detectAndSaveFacts(userId, message).catch(console.error)

    res.json({ response, navigate_to: navigateTo })
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
