import { Link } from 'react-router-dom'

const SCORE_DOT = {
  strong: 'bg-green-500',
  possible: 'bg-amber-400',
  unlikely: 'bg-gray-300',
}
const SCORE_LABEL = { strong: 'Strong', possible: 'Possible', unlikely: 'Unlikely' }
const SCORE_TEXT = { strong: 'text-green-700', possible: 'text-amber-600', unlikely: 'text-gray-400' }

const CATEGORY_LABEL = {
  food: 'Food',
  health: 'Health',
  housing: 'Housing',
  utilities: 'Utilities',
  financial: 'Financial',
  education: 'Education',
}

export default function ProgramCard({ userProgram }) {
  const { program_id, eligibility_score, missing_docs, programs: prog } = userProgram
  if (!prog) return null

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="mt-1.5 shrink-0">
        <span className={`block w-2 h-2 rounded-full ${SCORE_DOT[eligibility_score] ?? 'bg-gray-300'}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-900">{prog.name}</span>
          <span className="text-xs text-gray-400">{CATEGORY_LABEL[prog.category] ?? prog.category}</span>
        </div>
        {prog.description_en && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-1">{prog.description_en}</p>
        )}
        {missing_docs?.length > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">{missing_docs.join(' · ')}</p>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-4">
        <span className={`text-xs font-medium ${SCORE_TEXT[eligibility_score] ?? 'text-gray-400'}`}>
          {SCORE_LABEL[eligibility_score]}
        </span>
        <div className="flex items-center gap-2">
          <Link
            to={`/programs/${program_id}`}
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            Details
          </Link>
          <a
            href={prog.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Apply
          </a>
        </div>
      </div>
    </div>
  )
}
