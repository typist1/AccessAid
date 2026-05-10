import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function FullName({ value, onNext, onBack }) {
  const [firstName, setFirstName] = useState(value.first_name ?? '')
  const [lastName, setLastName] = useState(value.last_name ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What's your name?</h2>
        <p className="text-gray-500 mt-1">As it appears on your government ID.</p>
      </div>
      <Input
        label="First name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        placeholder="Maria"
        autoFocus
      />
      <Input
        label="Last name"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        placeholder="Hernandez"
      />
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button
          onClick={() => onNext({ first_name: firstName.trim(), last_name: lastName.trim() })}
          disabled={!firstName.trim() || !lastName.trim()}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
