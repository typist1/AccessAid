import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function EmployerInfo({ value, onNext, onBack }) {
  const [name, setName] = useState(value.employer_name ?? '')
  const [address, setAddress] = useState(value.employer_address ?? '')
  const [phone, setPhone] = useState(value.employer_phone ?? '')
  const [hours, setHours] = useState(value.hours_per_week ?? '')
  const [frequency, setFrequency] = useState(value.pay_frequency ?? '')

  const FREQUENCIES = ['Weekly', 'Every two weeks', 'Twice a month', 'Monthly']

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tell us about your employer</h2>
        <p className="text-gray-500 mt-1">Required for benefit applications. Skip if not currently employed.</p>
      </div>
      <Input label="Employer name" value={name} onChange={e => setName(e.target.value)} placeholder="Midwest Food Service LLC" autoFocus />
      <Input label="Employer address" value={address} onChange={e => setAddress(e.target.value)} placeholder="1800 S Pulaski Rd, Chicago IL 60623" />
      <Input label="Employer phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(773) 555-0100" />
      <Input label="Hours worked per week" type="number" min="0" max="168" value={hours} onChange={e => setHours(e.target.value)} placeholder="40" />
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">How often are you paid?</p>
        <div className="grid grid-cols-2 gap-2">
          {FREQUENCIES.map(f => (
            <button
              key={f}
              onClick={() => setFrequency(f)}
              className={`px-3 py-2 rounded-lg border-2 text-sm transition-colors ${frequency === f ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button variant="ghost" onClick={() => onNext({})}>Skip</Button>
        <Button
          onClick={() => onNext({ employer_name: name.trim(), employer_address: address.trim(), employer_phone: phone.trim(), hours_per_week: hours, pay_frequency: frequency })}
          disabled={!name.trim()}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
