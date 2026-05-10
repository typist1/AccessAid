import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import supabaseAdmin from '../lib/supabaseAdmin.js'
import { chat } from '../services/claude.js'

const router = Router()

// Map factKey to value, with first/last name splitting from full_name
function resolveFactValue(factsMap, factKey) {
  if (factsMap[factKey]) return factsMap[factKey]
  if (factKey === 'first_name' && factsMap.full_name) {
    return factsMap.full_name.split(' ')[0]
  }
  if (factKey === 'last_name' && factsMap.full_name) {
    const parts = factsMap.full_name.trim().split(' ')
    return parts[parts.length - 1]
  }
  return null
}

async function suggestMappings(labels, factsMap) {
  const availableKeys = Object.keys(factsMap)
  if (!availableKeys.length) return labels.map(label => ({ label, user_fact_key: null, confidence: 0 }))

  const response = await chat([
    {
      role: 'system',
      content: 'You are a form field mapper for government benefits portals. Map form field labels to user data keys. Return only valid JSON.',
    },
    {
      role: 'user',
      content: `Map these government form field labels to user fact keys.

Available user fact keys: ${JSON.stringify(availableKeys)}

Form field labels to map: ${JSON.stringify(labels)}

Notes:
- "First Name" maps to "first_name" or can be derived from "full_name"
- "Last Name" maps to "last_name" or can be derived from "full_name"
- Match semantically (e.g. "Number of people in household" → "household_size")
- Confidence 1.0 = exact match, 0.7-0.9 = confident semantic match, <0.7 = uncertain

Return JSON array, one entry per input label:
[{"label": "Field Label", "user_fact_key": "key_or_null", "confidence": 0.0}]`,
    },
  ])

  try {
    const clean = response.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(clean)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return labels.map(label => ({ label, user_fact_key: null, confidence: 0 }))
  }
}

// POST /api/extension/autofill
router.post('/autofill', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id
    const { portal_id, page_url, field_labels } = req.body

    if (!portal_id || !Array.isArray(field_labels) || !field_labels.length) {
      return res.status(400).json({ error: 'portal_id and field_labels required' })
    }

    const [{ data: factsRows }, { data: mappingRows }] = await Promise.all([
      supabaseAdmin.from('user_facts').select('field_key, field_value').eq('user_id', userId),
      supabaseAdmin.from('portal_field_mappings').select('field_label, user_fact_key').eq('portal_id', portal_id),
    ])

    const factsMap = Object.fromEntries((factsRows ?? []).map(r => [r.field_key, r.field_value]))
    if (!factsMap.email && req.user.email) factsMap.email = req.user.email

    // Case-insensitive lookup map
    const mappingMap = {}
    for (const row of (mappingRows ?? [])) {
      mappingMap[row.field_label.toLowerCase().trim()] = row.user_fact_key
    }

    const values = []
    const unfilled = []
    const unmapped = []

    for (const label of field_labels) {
      const factKey = mappingMap[label.toLowerCase().trim()]
      if (factKey) {
        const value = resolveFactValue(factsMap, factKey)
        if (value) {
          values.push({ label, value, user_fact_key: factKey, confidence: 1.0 })
        } else {
          unfilled.push(label)
        }
      } else {
        unmapped.push(label)
      }
    }

    // Use Claude to map any labels not in portal_field_mappings
    if (unmapped.length > 0) {
      try {
        const suggestions = await suggestMappings(unmapped, factsMap)
        const newMappings = []

        for (const s of suggestions) {
          if (s.confidence >= 0.7 && s.user_fact_key) {
            const value = resolveFactValue(factsMap, s.user_fact_key)
            if (value) {
              values.push({ label: s.label, value, user_fact_key: s.user_fact_key, confidence: s.confidence })
              let urlPattern = 'unknown'
              try { urlPattern = `${new URL(page_url).hostname}/*` } catch {}
              newMappings.push({ portal_id, url_pattern: urlPattern, field_label: s.label, user_fact_key: s.user_fact_key })
            } else {
              unfilled.push(s.label)
            }
          } else {
            unfilled.push(s.label)
          }
        }

        // Cache new mappings for future use
        if (newMappings.length) {
          await supabaseAdmin.from('portal_field_mappings').upsert(newMappings, {
            onConflict: 'portal_id,field_label',
            ignoreDuplicates: true,
          })
        }
      } catch (e) {
        console.error('LLM field mapping failed:', e.message)
        unfilled.push(...unmapped)
      }
    }

    res.json({ values, unfilled })
  } catch (err) {
    next(err)
  }
})

// POST /api/extension/submit
router.post('/submit', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id
    const { portal_id, program_id, page_url } = req.body

    // Update any matched programs for this portal to submitted
    const { data: programs } = await supabaseAdmin
      .from('programs')
      .select('id')
      .eq('application_portal_id', portal_id)

    if (programs?.length) {
      const programIds = program_id
        ? [program_id]
        : programs.map(p => p.id)

      await supabaseAdmin
        .from('user_programs')
        .update({ status: 'submitted', submitted_at: new Date().toISOString() })
        .eq('user_id', userId)
        .in('program_id', programIds)
        .in('status', ['matched', 'in_progress'])
    }

    res.json({ submitted: true })
  } catch (err) {
    next(err)
  }
})

export default router
