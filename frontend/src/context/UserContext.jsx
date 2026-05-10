import { createContext, useContext, useEffect, useState } from 'react'
import supabase from '../lib/supabase'
import { useAuthContext } from './AuthContext'
import { useLanguage } from './LanguageContext'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const { user } = useAuthContext()
  const { syncFromProfile } = useLanguage()
  const [profile, setProfile] = useState(undefined) // undefined=loading, null=no profile, obj=loaded
  const [facts, setFacts] = useState([])

  useEffect(() => {
    if (!user) {
      setProfile(undefined)
      setFacts([])
      return
    }
    fetchProfile()
    fetchFacts()
  }, [user])

  async function fetchProfile() {
    const { data } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', user.id)
      .single()
    setProfile(data ?? null) // null = confirmed no profile exists
    if (data?.language_preference) syncFromProfile(data.language_preference)
  }

  async function fetchFacts() {
    const { data } = await supabase
      .from('user_facts')
      .select('*')
      .eq('user_id', user.id)
    setFacts(data ?? [])
  }

  async function upsertFact(fieldKey, fieldValue, source = 'form') {
    const { data } = await supabase.from('user_facts').upsert(
      { user_id: user.id, field_key: fieldKey, field_value: String(fieldValue), source },
      { onConflict: 'user_id,field_key' }
    ).select().single()
    setFacts(prev => {
      const idx = prev.findIndex(f => f.field_key === fieldKey)
      return idx >= 0
        ? prev.map((f, i) => i === idx ? data : f)
        : [...prev, data]
    })
  }

  return (
    <UserContext.Provider value={{ profile, facts, fetchProfile, fetchFacts, upsertFact }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  return useContext(UserContext)
}
