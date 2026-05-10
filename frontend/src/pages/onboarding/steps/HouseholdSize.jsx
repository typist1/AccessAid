import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function HouseholdSize({ value, onNext, onBack }) {
  const [size, setSize] = useState(value.household_size ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">How many people are in your household?</h2>
        <p className="text-gray-500 mt-1">Include yourself and everyone you live and share expenses with.</p>
      </div>
      <Input label="Household size" type="number" min="1" max="20" value={size} onChange={e => setSize(e.target.value)} placeholder="3" autoFocus />
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button onClick={() => onNext({ household_size: size })} disabled={!size || size < 1}>Continue</Button>
      </div>
    </div>
  )
}
