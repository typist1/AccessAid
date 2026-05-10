import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function DateOfBirth({ value, onNext, onBack }) {
  const [dob, setDob] = useState(value.date_of_birth ?? '')

  function isValid(d) {
    if (!d) return false
    const parsed = new Date(d)
    if (isNaN(parsed)) return false
    const age = Math.floor((Date.now() - parsed) / (365.25 * 24 * 60 * 60 * 1000))
    return age >= 0 && age <= 120
  }

  function handleNext() {
    const parsed = new Date(dob)
    const age = Math.floor((Date.now() - parsed) / (365.25 * 24 * 60 * 60 * 1000))
    onNext({ date_of_birth: dob, age: String(age) })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What's your date of birth?</h2>
        <p className="text-gray-500 mt-1">Required for most benefit applications.</p>
      </div>
      <Input
        label="Date of birth"
        type="date"
        value={dob}
        onChange={e => setDob(e.target.value)}
        autoFocus
      />
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button onClick={handleNext} disabled={!isValid(dob)}>Continue</Button>
      </div>
    </div>
  )
}
