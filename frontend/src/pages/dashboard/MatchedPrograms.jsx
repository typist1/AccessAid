import { useState } from 'react'
import ProgramCard from '../../components/programs/ProgramCard'
import Spinner from '../../components/ui/Spinner'

function ProgramList({ programs }) {
  return (
    <div className="grid gap-4">
      {programs.map(up => <ProgramCard key={up.id} userProgram={up} />)}
    </div>
  )
}

function MatchSection({ title, description, eyebrow, programs }) {
  if (programs.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{eyebrow}</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <div className="inline-flex w-fit items-center rounded-md border border-stone-200 bg-stone-100 px-3 py-1.5 text-sm font-medium text-slate-700">
          {programs.length} program{programs.length === 1 ? '' : 's'}
        </div>
      </div>

      <ProgramList programs={programs} />
    </section>
  )
}

export default function MatchedPrograms({ programs, loading }) {
  const [showUnlikely, setShowUnlikely] = useState(false)

  const strong = programs.filter(p => p.eligibility_score === 'strong')
  const possible = programs.filter(p => p.eligibility_score === 'possible')
  const unlikely = programs.filter(p => p.eligibility_score === 'unlikely')

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>
  }

  if (programs.length === 0) {
    return <p className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-sm text-slate-500">Complete your profile to see recommended programs here.</p>
  }

  return (
    <div className="flex flex-col gap-10">
      <MatchSection
        title="Start with these"
        eyebrow="Top picks"
        description="These look like the best use of your time based on the information in your profile."
        programs={strong}
      />

      <MatchSection
        title="Also worth checking"
        eyebrow="Good backups"
        description="These may still fit, especially if your situation has details the quick screener did not capture."
        programs={possible}
      />

      {unlikely.length > 0 && (
        <div className="rounded-3xl border border-stone-200 bg-stone-50/80 p-5">
          <button
            onClick={() => setShowUnlikely(v => !v)}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            {showUnlikely ? 'Hide' : 'Show'} lower-priority options ({unlikely.length})
          </button>
          {showUnlikely && (
            <div className="mt-4">
              <ProgramList programs={unlikely} />
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-slate-400">Informational only. Final eligibility is confirmed by the official application.</p>
    </div>
  )
}
