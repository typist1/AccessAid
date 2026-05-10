import { useState } from 'react'
import Button from '../../../components/ui/Button'

const OPTIONS = [
  { value: '<15k', label: 'Under $15,000 / year' },
  { value: '15-30k', label: '$15,000 – $30,000 / year' },
  { value: '30-50k', label: '$30,000 – $50,000 / year' },
  { value: '50k+', label: 'Over $50,000 / year' },
]

export default function Income({ value, onNext, onBack }) {
  const [income, setIncome] = useState(value.income ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What's your annual household income?</h2>
        <p className="text-gray-500 mt-1">Include all income sources for your household.</p>
      </div>
      <div className="flex flex-col gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setIncome(opt.value)}
            className={`text-left px-4 py-3 rounded-lg border-2 transition-colors ${income === opt.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button onClick={() => onNext({ income })} disabled={!income}>Continue</Button>
      </div>
    </div>
  )
}
