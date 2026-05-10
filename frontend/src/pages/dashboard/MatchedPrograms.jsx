import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProgramCard from '../../components/programs/ProgramCard'
import Spinner from '../../components/ui/Spinner'

function ProgramList({ programs }) {
  return (
    <div className="flex flex-col gap-4">
      {programs.map(up => <ProgramCard key={up.id} userProgram={up} />)}
    </div>
  )
}

function MatchSection({ title, description, eyebrow, programs }) {
  const { t } = useTranslation()
  if (programs.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#9b6ff0' }}>{eyebrow}</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight" style={{ color: '#1e0f3d' }}>{title}</h3>
          <p className="mt-1 text-sm leading-6" style={{ color: '#7c5bb5' }}>{description}</p>
        </div>
        <div className="inline-flex w-fit items-center rounded-lg px-3 py-1.5 text-sm font-medium"
          style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}>
          {programs.length === 1 ? t('dashboard.program_count_singular', { count: 1 }) : t('dashboard.program_count_plural', { count: programs.length })}
        </div>
      </div>
      <ProgramList programs={programs} />
    </section>
  )
}

export default function MatchedPrograms({ programs, loading }) {
  const { t } = useTranslation()
  const [showUnlikely, setShowUnlikely] = useState(false)

  const strong = programs.filter(p => p.eligibility_score === 'strong')
  const possible = programs.filter(p => p.eligibility_score === 'possible')
  const unlikely = programs.filter(p => p.eligibility_score === 'unlikely')

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>
  }

  if (programs.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed px-6 py-10 text-sm"
        style={{ borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.04)', color: '#9b6ff0' }}>
        {t('dashboard.matched_programs_empty')}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <MatchSection
        eyebrow={t('dashboard.strong_eyebrow')}
        title={t('dashboard.strong_title')}
        description={t('dashboard.strong_desc')}
        programs={strong}
      />

      <MatchSection
        eyebrow={t('dashboard.possible_eyebrow')}
        title={t('dashboard.possible_title')}
        description={t('dashboard.possible_desc')}
        programs={possible}
      />

      {unlikely.length > 0 && (
        <div className="rounded-2xl border p-5"
          style={{ borderColor: 'rgba(124,58,237,0.1)', background: 'rgba(124,58,237,0.03)' }}>
          <button
            onClick={() => setShowUnlikely(v => !v)}
            className="text-sm font-medium transition-colors"
            style={{ color: '#9b6ff0' }}
          >
            {showUnlikely ? t('dashboard.hide_unlikely', { count: unlikely.length }) : t('dashboard.show_unlikely', { count: unlikely.length })}
          </button>
          {showUnlikely && (
            <div className="mt-4">
              <ProgramList programs={unlikely} />
            </div>
          )}
        </div>
      )}

      <p className="text-xs" style={{ color: '#b09fd4' }}>
        {t('dashboard.informational_note')}
      </p>
    </div>
  )
}
