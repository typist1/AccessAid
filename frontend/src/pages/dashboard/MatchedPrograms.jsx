import { useState } from 'react'
import ProgramCard from '../../components/programs/ProgramCard'
import Spinner from '../../components/ui/Spinner'

function ProgramList({ programs }) {
  return (
    <div className="bg-white border border-gray-200 rounded divide-y divide-gray-100 px-4">
      {programs.map(up => <ProgramCard key={up.id} userProgram={up} />)}
    </div>
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
    return <p className="text-sm text-gray-400 py-8">Complete your profile to see matched programs.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      {strong.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Strong matches</p>
          <ProgramList programs={strong} />
        </div>
      )}

      {possible.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Possible matches</p>
          <ProgramList programs={possible} />
        </div>
      )}

      {unlikely.length > 0 && (
        <div>
          <button
            onClick={() => setShowUnlikely(v => !v)}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showUnlikely ? 'Hide' : 'Show'} {unlikely.length} unlikely programs
          </button>
          {showUnlikely && <div className="mt-2"><ProgramList programs={unlikely} /></div>}
        </div>
      )}

      <p className="text-xs text-gray-400">Informational only — not legal advice. Confirm by applying.</p>
    </div>
  )
}
