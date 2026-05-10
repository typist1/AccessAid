const VARIANTS = {
  food: 'bg-green-100 text-green-800',
  health: 'bg-blue-100 text-blue-800',
  housing: 'bg-orange-100 text-orange-800',
  utilities: 'bg-yellow-100 text-yellow-800',
  financial: 'bg-purple-100 text-purple-800',
  education: 'bg-indigo-100 text-indigo-800',
  strong: 'bg-green-100 text-green-800',
  possible: 'bg-yellow-100 text-yellow-800',
  unlikely: 'bg-red-100 text-red-800',
  matched: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-800',
  submitted: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
}

export default function Badge({ children, variant = 'matched' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant] ?? 'bg-gray-100 text-gray-700'}`}>
      {children}
    </span>
  )
}
