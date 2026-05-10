import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePrograms } from '../../hooks/usePrograms'
import { useUserContext } from '../../context/UserContext'
import Sidebar from '../../components/layout/Sidebar'
import MatchedPrograms from './MatchedPrograms'
import ApplicationTracker from './ApplicationTracker'
import SearchModal from './SearchModal'
import ChatWidget from '../../components/chat/ChatWidget'
import dancingImg from '../../assets/dancing.png'
import meditationImg from '../../assets/meditation.png'
import dance2Img from '../../assets/dance2.png'

export default function Dashboard() {
  const { t } = useTranslation()
  const { profile } = useUserContext()
  const { programs, loading, refetch } = usePrograms()
  const [searchOpen, setSearchOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  const strong = programs.filter(p => p.eligibility_score === 'strong').length
  const possible = programs.filter(p => p.eligibility_score === 'possible').length
  const total = strong + possible

  return (
    <Sidebar>
      <div className="relative min-h-screen overflow-hidden">
        <img
          src={dancingImg}
          className="absolute bottom-0 right-0 w-44 pointer-events-none select-none opacity-90 z-0"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(109,40,217,0.15))' }}
          alt=""
        />
        <img
          src={dance2Img}
          className="absolute top-6 right-2 w-36 pointer-events-none select-none opacity-75 z-0"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(109,40,217,0.1))' }}
          alt=""
        />
        <img
          src={meditationImg}
          className="absolute bottom-24 right-48 w-28 pointer-events-none select-none opacity-50 z-0"
          style={{ filter: 'drop-shadow(0 2px 8px rgba(109,40,217,0.1))' }}
          alt=""
        />

        <div className="max-w-2xl mx-auto px-8 py-10 flex flex-col gap-10 relative z-10">

          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1e0f3d' }}>
              {profile?.full_name ? t('dashboard.greeting', { name: profile.full_name.split(' ')[0] }) : t('dashboard.title')}
            </h1>
            {!loading && programs.length > 0 && (
              <p className="text-sm mt-1" style={{ color: '#7c5bb5' }}>
                {strong > 0 && <><span className="font-semibold text-emerald-600">{t('dashboard.matches_strong', { count: strong })}</span>{possible > 0 ? ', ' : ''}</>}
                {possible > 0 && <span className="font-semibold text-amber-600">{t('dashboard.matches_possible', { count: possible })}</span>}
                {' '}{total === 1 ? t('dashboard.matches_found_singular') : t('dashboard.matches_found_plural')}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#7c5bb5' }}>
                {t('dashboard.programs_heading')}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                  style={{ background: 'rgba(45,22,89,0.08)', color: '#2d1659', border: '1px solid rgba(45,22,89,0.18)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(45,22,89,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(45,22,89,0.08)'}
                >
                  {t('dashboard.search_programs')}
                </button>
                <button
                  onClick={() => setChatOpen(true)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                  style={{ background: 'rgba(45,22,89,0.08)', color: '#2d1659', border: '1px solid rgba(45,22,89,0.18)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(45,22,89,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(45,22,89,0.08)'}
                >
                  {t('dashboard.ask_assistant')}
                </button>
              </div>
            </div>
            <MatchedPrograms programs={programs} loading={loading} />
          </div>

          <ApplicationTracker programs={programs} />
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onAdded={refetch} />
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </Sidebar>
  )
}
