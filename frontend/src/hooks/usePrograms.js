import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'
import { useAuthContext } from '../context/AuthContext'
import { useUserContext } from '../context/UserContext'
import { scoreEligibility } from '../lib/eligibilityEngine'
import { PROGRAMS } from '../data/programs'

const SCORE_ORDER = { strong: 0, possible: 1, unlikely: 2 }

export function usePrograms() {
  const { user } = useAuthContext()
  const { profile } = useUserContext()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !profile) return
    scorePrograms()
  }, [user, profile])

  async function scorePrograms() {
    setLoading(true)

    // Fetch application status from DB (may be empty — that's fine)
    const { data: userProgs } = await supabase
      .from('user_programs')
      .select('program_id, status')
      .eq('user_id', user.id)

    const statusMap = Object.fromEntries(
      (userProgs ?? []).map(r => [r.program_id, r.status])
    )

    const scored = PROGRAMS
      .map(prog => {
        const { score, missing } = scoreEligibility(profile, prog)
        return {
          id: prog.id,
          program_id: prog.id,
          programs: prog,
          eligibility_score: score,
          missing_docs: missing,
          status: statusMap[prog.id] ?? 'matched',
        }
      })
      .sort((a, b) => (SCORE_ORDER[a.eligibility_score] ?? 2) - (SCORE_ORDER[b.eligibility_score] ?? 2))

    setPrograms(scored)
    setLoading(false)
  }

  return { programs, loading, refetch: scorePrograms }
}
