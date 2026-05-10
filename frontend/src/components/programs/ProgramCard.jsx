import { Link } from 'react-router-dom'

const SCORE_STYLES = {
  strong: {
    shell: 'bg-emerald-50 text-emerald-900',
    bar: 'bg-emerald-500',
    label: 'Best bet',
    accent: 'from-emerald-500 via-lime-400 to-emerald-300',
    summary: 'Likely worth starting now',
  },
  possible: {
    shell: 'bg-amber-50 text-amber-900',
    bar: 'bg-amber-500',
    label: 'Worth checking',
    accent: 'from-amber-400 via-orange-300 to-yellow-200',
    summary: 'May fit, but verify the details',
  },
  unlikely: {
    shell: 'bg-slate-100 text-slate-800',
    bar: 'bg-slate-500',
    label: 'Less likely',
    accent: 'from-slate-400 via-slate-300 to-slate-200',
    summary: 'Probably not the best use of your time first',
  },
}

const CATEGORY_META = {
  food: { label: 'Food', shell: 'bg-rose-50 text-rose-900', bar: 'bg-rose-500' },
  health: { label: 'Health', shell: 'bg-sky-50 text-sky-900', bar: 'bg-sky-500' },
  housing: { label: 'Housing', shell: 'bg-orange-50 text-orange-900', bar: 'bg-orange-500' },
  utilities: { label: 'Utilities', shell: 'bg-yellow-50 text-yellow-900', bar: 'bg-yellow-500' },
  financial: { label: 'Financial', shell: 'bg-emerald-50 text-emerald-900', bar: 'bg-emerald-500' },
  education: { label: 'Education', shell: 'bg-violet-50 text-violet-900', bar: 'bg-violet-500' },
}

export default function ProgramCard({ userProgram }) {
  const { program_id, eligibility_score, missing_docs, programs: prog } = userProgram
  if (!prog) return null

  const scoreStyle = SCORE_STYLES[eligibility_score] ?? SCORE_STYLES.unlikely
  const category = CATEGORY_META[prog.category] ?? {
    label: prog.category,
    shell: 'bg-slate-50 text-slate-900',
    bar: 'bg-slate-500',
  }

  const missingCount = missing_docs?.length ?? 0
  const readinessCopy = missingCount > 0
    ? `${missingCount} thing${missingCount === 1 ? '' : 's'} to check before you apply`
    : 'Looks ready to review and start'

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-lg">
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${scoreStyle.accent}`} />

      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-stretch overflow-hidden rounded-sm ${category.shell}`}>
                <span aria-hidden="true" className={`w-1.5 shrink-0 ${category.bar}`} />
                <span className="px-3 py-1.5 text-xs font-semibold">
                  {category.label}
                </span>
              </span>
              <span className={`inline-flex items-stretch overflow-hidden rounded-sm ${scoreStyle.shell}`}>
                <span aria-hidden="true" className={`w-1.5 shrink-0 ${scoreStyle.bar}`} />
                <span className="px-3 py-1.5 text-xs font-semibold">
                  {scoreStyle.label}
                </span>
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{prog.name}</h3>
              <p className="mt-1 text-sm font-medium text-slate-600">{scoreStyle.summary}</p>
            </div>

            {prog.description_en && (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 line-clamp-2">{prog.description_en}</p>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-2 rounded-2xl bg-stone-50 px-4 py-3 text-sm text-slate-700 sm:min-w-56">
            <p className="font-semibold text-slate-900">Before you start</p>
            <p>{readinessCopy}</p>
            {missingCount > 0 && (
              <p className="text-xs leading-5 text-slate-500">
                Missing: {missing_docs.map(doc => doc.replace(/_/g, ' ')).slice(0, 2).join(', ')}
                {missingCount > 2 ? ` +${missingCount - 2} more` : ''}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            See requirements, documents, and next steps before applying.
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to={`/programs/${program_id}`}
              className="inline-flex min-w-[11.5rem] items-center justify-center whitespace-nowrap rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              View details
            </Link>
            <a
              href={prog.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-[13rem] items-center justify-center whitespace-nowrap rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
            >
              Official application
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
