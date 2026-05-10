import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function SSN({ value, onNext, onBack }) {
  const [last4, setLast4] = useState(value.ssn_last4 ?? '')

  function handleChange(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4)
    setLast4(v)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Last 4 digits of your Social Security Number</h2>
        <p className="text-gray-500 mt-1">We store only the last 4. Required for most benefit applications.</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 font-mono text-lg">XXX – XX –</span>
        <Input
          label=""
          type="text"
          inputMode="numeric"
          value={last4}
          onChange={handleChange}
          placeholder="1234"
          maxLength={4}
          className="w-24 font-mono text-lg"
          autoFocus
        />
      </div>
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button variant="ghost" onClick={() => onNext({ ssn_last4: '' })}>Skip</Button>
        <Button onClick={() => onNext({ ssn_last4: last4 })} disabled={last4.length !== 4}>Continue</Button>
      </div>
    </div>
  )
}
