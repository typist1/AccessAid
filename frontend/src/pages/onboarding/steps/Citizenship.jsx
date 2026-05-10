import { useState } from 'react'
import Button from '../../../components/ui/Button'

const OPTIONS = [
  { value: 'citizen', label: 'U.S. Citizen' },
  { value: 'permanent_resident', label: 'Permanent Resident (Green Card)' },
  { value: 'visa', label: 'Visa Holder' },
  { value: 'undocumented', label: 'Undocumented' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

export default function Citizenship({ value, onNext, onBack }) {
  const [status, setStatus] = useState(value.citizenship_status ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What's your citizenship status?</h2>
        <p className="text-gray-500 mt-1">Some programs are available regardless of status. Your data is private and secure.</p>
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
        <Button onClick={() => onNext({ citizenship_status: status })} disabled={!status}>Continue</Button>
      </div>
    </div>
  )
}
