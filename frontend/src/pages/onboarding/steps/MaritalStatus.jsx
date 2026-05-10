import { useState } from 'react'
import Button from '../../../components/ui/Button'

const OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'separated', label: 'Separated' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
]

export default function MaritalStatus({ value, onNext, onBack }) {
  const [status, setStatus] = useState(value.marital_status ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What's your marital status?</h2>
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
        <Button onClick={() => onNext({ marital_status: status })} disabled={!status}>Continue</Button>
      </div>
    </div>
  )
}
