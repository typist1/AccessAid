import { useState } from 'react'
import { usePrograms } from '../../hooks/usePrograms'
import { useUserContext } from '../../context/UserContext'
import Sidebar from '../../components/layout/Sidebar'
import MatchedPrograms from './MatchedPrograms'
import ApplicationTracker from './ApplicationTracker'
import SearchModal from './SearchModal'
import ChatWidget from '../../components/chat/ChatWidget'

export default function Dashboard() {
  const { profile } = useUserContext()
  const { programs, loading, refetch } = usePrograms()
  const [searchOpen, setSearchOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  const strong = programs.filter(p => p.eligibility_score === 'strong').length
  const possible = programs.filter(p => p.eligibility_score === 'possible').length

  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-10">

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {profile?.full_name ?? 'Dashboard'}
          </h1>
          {!loading && programs.length > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              {strong} strong, {possible} possible
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-700">Programs</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                Search
              </button>
              <button
                onClick={() => setChatOpen(true)}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                Ask Assistant
              </button>
            </div>
          </div>
          <MatchedPrograms programs={programs} loading={loading} />
        </div>

        <ApplicationTracker programs={programs} />
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onAdded={refetch} />
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </Sidebar>
  )
}
