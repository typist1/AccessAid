const VARIANTS = {
  food: 'bg-gray-100 text-gray-600',
  health: 'bg-gray-100 text-gray-600',
  housing: 'bg-gray-100 text-gray-600',
  utilities: 'bg-gray-100 text-gray-600',
  financial: 'bg-gray-100 text-gray-600',
  education: 'bg-gray-100 text-gray-600',
  strong: 'bg-green-600 text-white',
  possible: 'bg-amber-500 text-white',
  unlikely: 'bg-gray-200 text-gray-500',
  matched: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-600 text-white',
  submitted: 'bg-indigo-600 text-white',
  approved: 'bg-green-600 text-white',
  denied: 'bg-red-600 text-white',
}

export default function Badge({ children, variant = 'matched', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium tracking-wide uppercase ${VARIANTS[variant] ?? 'bg-gray-100 text-gray-600'} ${className}`}>
      {children}
    </span>
  )
}
