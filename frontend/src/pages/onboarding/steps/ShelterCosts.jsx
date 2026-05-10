import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function ShelterCosts({ value, onNext, onBack }) {
  const [rent, setRent] = useState(value.monthly_rent ?? '')
  const [heatingIncluded, setHeatingIncluded] = useState(value.heating_included ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What are your housing costs?</h2>
        <p className="text-gray-500 mt-1">Monthly rent or mortgage. Used to calculate SNAP shelter deductions.</p>
      </div>
      <Input
        label="Monthly rent or mortgage ($)"
        type="number"
        min="0"
        value={rent}
        onChange={e => setRent(e.target.value)}
        placeholder="1050"
        autoFocus
      />
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Is heat or A/C included in your rent?</p>
        <div className="flex gap-3">
          {[{ value: 'yes', label: 'Yes, included' }, { value: 'no', label: 'No, billed separately' }].map(opt => (
            <button
              key={opt.value}
              onClick={() => setHeatingIncluded(opt.value)}
              className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${heatingIncluded === opt.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button variant="ghost" onClick={() => onNext({})}>Skip</Button>
        <Button
          onClick={() => onNext({ monthly_rent: rent, heating_included: heatingIncluded })}
          disabled={!rent}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
