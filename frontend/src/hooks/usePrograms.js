import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'
import { useAuthContext } from '../context/AuthContext'

export function usePrograms() {
  const { user } = useAuthContext()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchPrograms()
  }, [user])

  async function fetchPrograms() {
    setLoading(true)
    const { data } = await supabase
      .from('user_programs')
      .select('*, programs(name, category, application_url, deadline, description_en, required_documents)')
      .eq('user_id', user.id)
      .order('eligibility_score', { ascending: false })
    setPrograms(data ?? [])
    setLoading(false)
  }

  return { programs, loading, refetch: fetchPrograms }
}
