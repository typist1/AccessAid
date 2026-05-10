import { useState } from 'react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

function toBucket(monthly) {
  const annual = monthly * 12
  if (annual < 15000) return '<15k'
  if (annual < 30000) return '15-30k'
  if (annual < 50000) return '30-50k'
  return '50k+'
}

export default function Income({ value, onNext, onBack }) {
  const [monthly, setMonthly] = useState(value.monthly_income_current ?? '')

  function handleNext() {
    const amount = parseFloat(monthly) || 0
    onNext({
      monthly_income_current: String(amount),
      income: toBucket(amount),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What's your current monthly income?</h2>
        <p className="text-gray-500 mt-1">Before taxes, all sources. Enter 0 if currently unemployed.</p>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
        <input
          type="number"
          min="0"
          value={monthly}
          onChange={e => setMonthly(e.target.value)}
          placeholder="0"
          autoFocus
          className="w-full pl-7 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
        />
      </div>
      {monthly !== '' && (
        <p className="text-sm text-gray-500">
          Annual estimate: <span className="font-semibold text-gray-700">${(parseFloat(monthly) * 12).toLocaleString()}</span>
        </p>
      )}
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button onClick={handleNext} disabled={monthly === ''}>Continue</Button>
      </div>
    </div>
  )
}
