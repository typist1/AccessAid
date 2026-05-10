import { createContext, useContext, useState } from 'react'
import i18n from '../i18n'
import supabase from '../lib/supabase'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    localStorage.getItem('language') ?? 'en'
  )

  async function setLanguage(lang) {
    localStorage.setItem('language', lang)
    setLanguageState(lang)
    await i18n.changeLanguage(lang)

    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ language_preference: lang }),
      }).catch(console.error)
    }
  }

  function syncFromProfile(profileLanguage) {
    if (profileLanguage && profileLanguage !== language) {
      localStorage.setItem('language', profileLanguage)
      setLanguageState(profileLanguage)
      i18n.changeLanguage(profileLanguage)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, syncFromProfile }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
