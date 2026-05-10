const VARIANTS = {
  food: { shell: 'bg-rose-50', text: 'text-rose-900', bar: 'bg-rose-500' },
  health: { shell: 'bg-sky-50', text: 'text-sky-900', bar: 'bg-sky-500' },
  housing: { shell: 'bg-orange-50', text: 'text-orange-900', bar: 'bg-orange-500' },
  utilities: { shell: 'bg-amber-50', text: 'text-amber-900', bar: 'bg-amber-500' },
  financial: { shell: 'bg-emerald-50', text: 'text-emerald-900', bar: 'bg-emerald-500' },
  education: { shell: 'bg-violet-50', text: 'text-violet-900', bar: 'bg-violet-500' },
  strong: { shell: 'bg-emerald-50', text: 'text-emerald-900', bar: 'bg-emerald-500' },
  possible: { shell: 'bg-amber-50', text: 'text-amber-900', bar: 'bg-amber-500' },
  unlikely: { shell: 'bg-slate-100', text: 'text-slate-800', bar: 'bg-slate-500' },
  matched: { shell: 'bg-slate-100', text: 'text-slate-800', bar: 'bg-slate-500' },
  in_progress: { shell: 'bg-blue-50', text: 'text-blue-900', bar: 'bg-blue-500' },
  submitted: { shell: 'bg-indigo-50', text: 'text-indigo-900', bar: 'bg-indigo-500' },
  approved: { shell: 'bg-emerald-50', text: 'text-emerald-900', bar: 'bg-emerald-500' },
  denied: { shell: 'bg-red-50', text: 'text-red-900', bar: 'bg-red-500' },
}

export default function Badge({ children, variant = 'matched', className = '' }) {
  const style = VARIANTS[variant] ?? VARIANTS.matched

  return (
    <span className={`inline-flex items-stretch overflow-hidden rounded-sm ${style.shell} ${style.text} ${className}`}>
      <span aria-hidden="true" className={`w-1.5 shrink-0 ${style.bar}`} />
      <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
        {children}
      </span>
    </span>
  )
}
