import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function Age({ value, onNext, onBack }) {
  const [age, setAge] = useState(value.age ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">How old are you?</h2>
        <p className="text-gray-500 mt-1">Age determines eligibility for programs like Social Security and SSI.</p>
      </div>
      <Input label="Age" type="number" min="0" max="120" value={age} onChange={e => setAge(e.target.value)} placeholder="34" autoFocus />
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button onClick={() => onNext({ age })} disabled={!age}>Continue</Button>
      </div>
    </div>
  )
}
