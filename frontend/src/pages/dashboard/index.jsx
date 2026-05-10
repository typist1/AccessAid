import { useState } from 'react'
import supabase from '../../lib/supabase'
import { usePrograms } from '../../hooks/usePrograms'
import { useAuthContext } from '../../context/AuthContext'
import { useUserContext } from '../../context/UserContext'
import Sidebar from '../../components/layout/Sidebar'
import MatchedPrograms from './MatchedPrograms'
import ApplicationTracker from './ApplicationTracker'
import QuickActions from './QuickActions'
import SearchModal from './SearchModal'
import ChatWidget from '../../components/chat/ChatWidget'

export default function Dashboard() {
  const { user } = useAuthContext()
  const { profile } = useUserContext()
  const { programs, loading, refetch } = usePrograms()
  const [searchOpen, setSearchOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  async function handleRefresh() {
    setRefreshing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/eligibility/score`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <Sidebar>
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-gray-600 mt-1">Here are programs you may qualify for.</p>
        </div>

        <QuickActions onSearch={() => setSearchOpen(true)} onChat={() => setChatOpen(true)} />

        <MatchedPrograms
          programs={programs}
          loading={loading}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />

        <ApplicationTracker programs={programs} />
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onAdded={refetch} />
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </Sidebar>
  )
}
