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
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-8 sm:px-8 sm:py-10">

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {profile?.full_name ?? 'Dashboard'}
          </h1>
          {!loading && programs.length > 0 && (
            <p className="mt-2 text-sm text-slate-500">
              {strong} strong match{strong === 1 ? '' : 'es'}, {possible} possible option{possible === 1 ? '' : 's'}
            </p>
          )}
        </div>

        <section className="overflow-hidden rounded-[32px] border border-stone-200 bg-gradient-to-br from-white via-stone-50 to-orange-50 shadow-sm">
          <div className="border-b border-stone-200/80 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Programs</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Benefits that look worth your time</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Start with the strongest matches first, then review the backup options if you need more support.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {!loading && (
                  <>
                    <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 backdrop-blur">
                      <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Best bets</div>
                      <div className="mt-1 text-2xl font-semibold text-slate-900">{strong}</div>
                    </div>
                    <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 backdrop-blur">
                      <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Worth checking</div>
                      <div className="mt-1 text-2xl font-semibold text-slate-900">{possible}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-5 sm:px-8">
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="inline-flex items-center rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
              >
                Search programs
              </button>
              <button
                onClick={() => setChatOpen(true)}
                className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              >
                Ask assistant
              </button>
            </div>

            <MatchedPrograms programs={programs} loading={loading} />
          </div>
        </section>

        <ApplicationTracker programs={programs} />
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onAdded={refetch} />
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </Sidebar>
  )
}
