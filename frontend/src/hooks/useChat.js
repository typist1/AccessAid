import { useState } from 'react'
import supabase from '../lib/supabase'
import { useLanguage } from '../context/LanguageContext'

export function useChat(programContext = null, initialMessage = null) {
  const { language } = useLanguage()
  const [history, setHistory] = useState(
    initialMessage ? [{ role: 'assistant', content: initialMessage }] : []
  )
  const [loading, setLoading] = useState(false)

  async function sendMessage(message) {
    const detectedLanguage = language
    const userMsg = { role: 'user', content: message }
    setHistory(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ message, history, programContext, detectedLanguage }),
      })
      const data = await res.json()
      const assistantMsg = { role: 'assistant', content: data.response }
      setHistory(prev => [...prev, assistantMsg])
      return { response: data.response, navigate_to: data.navigate_to ?? null }
    } finally {
      setLoading(false)
    }
  }

  return { history, loading, sendMessage }
}
