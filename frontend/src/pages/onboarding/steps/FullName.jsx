import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function FullName({ value, onNext, onBack }) {
  const [name, setName] = useState(value.full_name ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What's your full name?</h2>
        <p className="text-gray-500 mt-1">We'll use this to personalize your experience.</p>
      </div>
      <Input label="Full name" value={name} onChange={e => setName(e.target.value)} placeholder="Maria Hernandez" autoFocus />
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button onClick={() => onNext({ full_name: name })} disabled={!name.trim()}>Continue</Button>
      </div>
    </div>
  )
}
