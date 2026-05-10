import { useState } from 'react'
import Button from '../../../components/ui/Button'

const OPTIONS = [
  { value: 'employed', label: 'Employed full-time' },
  { value: 'part-time', label: 'Employed part-time' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'retired', label: 'Retired' },
  { value: 'student', label: 'Student' },
  { value: 'self-employed', label: 'Self-employed' },
]

export default function Employment({ value, onNext, onBack }) {
  const [status, setStatus] = useState(value.employment_status ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What's your employment status?</h2>
      </div>
      <div className="flex flex-col gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setStatus(opt.value)}
            className={`text-left px-4 py-3 rounded-lg border-2 transition-colors ${status === opt.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button onClick={() => onNext({ employment_status: status })} disabled={!status}>Continue</Button>
      </div>
    </div>
  )
}
