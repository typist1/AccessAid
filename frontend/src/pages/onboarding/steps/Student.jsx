import { useState } from 'react'
import Button from '../../../components/ui/Button'

export default function Student({ value, onNext, onBack }) {
  const [status, setStatus] = useState(value.student_status ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Are you currently a student?</h2>
        <p className="text-gray-500 mt-1">Includes college, vocational, or other accredited programs.</p>
      </div>
      <div className="flex gap-3">
        {['yes', 'no'].map(opt => (
          <button
            key={opt}
            onClick={() => setStatus(opt)}
            className={`flex-1 py-3 rounded-lg border-2 capitalize font-medium transition-colors ${status === opt ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button onClick={() => onNext({ student_status: status })} disabled={!status}>Continue</Button>
      </div>
    </div>
  )
}
