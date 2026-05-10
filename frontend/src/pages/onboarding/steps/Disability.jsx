import { useState } from 'react'
import Button from '../../../components/ui/Button'

const OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

export default function Disability({ value, onNext, onBack }) {
  const [status, setStatus] = useState(value.disability_status ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Do you have a disability?</h2>
        <p className="text-gray-500 mt-1">Some programs like SSI and SSDI are specifically for people with disabilities.</p>
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
        <Button onClick={() => onNext({ disability_status: status })} disabled={!status}>Continue</Button>
      </div>
    </div>
  )
}
