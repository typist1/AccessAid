import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function Pregnant({ value, onNext, onBack }) {
  const [pregnant, setPregnant] = useState(value.pregnant ?? '')
  const [dueDate, setDueDate] = useState(value.due_date ?? '')
  const [babies, setBabies] = useState(value.babies_expected ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Are you currently pregnant?</h2>
        <p className="text-gray-500 mt-1">Pregnancy may qualify you for additional benefits.</p>
      </div>
      <div className="flex gap-3">
        {['yes', 'no', 'prefer_not_to_say'].map(opt => (
          <button
            key={opt}
            onClick={() => setPregnant(opt)}
            className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors capitalize ${pregnant === opt ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
          >
            {opt === 'prefer_not_to_say' ? 'Prefer not to say' : opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>
      {pregnant === 'yes' && (
        <div className="flex flex-col gap-3">
          <Input label="Due date (optional)" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <Input label="Number of babies expected" type="number" min="1" max="10" value={babies} onChange={e => setBabies(e.target.value)} placeholder="1" />
        </div>
      )}
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button
          onClick={() => onNext({ pregnant, due_date: dueDate, babies_expected: babies })}
          disabled={!pregnant}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
