import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function Address({ value, onNext, onBack }) {
  const [street, setStreet] = useState(value.address ?? '')
  const [apt, setApt] = useState(value.apartment_number ?? '')
  const [city, setCity] = useState(value.city ?? '')
  const [zip, setZip] = useState(value.zip_code ?? '')
  const [county, setCounty] = useState(value.county ?? '')

  const canContinue = street.trim() && city.trim() && zip.trim().length >= 5

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What's your home address?</h2>
        <p className="text-gray-500 mt-1">Where you currently live — must match your ID.</p>
      </div>
      <Input label="Street address" value={street} onChange={e => setStreet(e.target.value)} placeholder="4521 W 63rd St" autoFocus />
      <Input label="Apartment / unit (optional)" value={apt} onChange={e => setApt(e.target.value)} placeholder="Apt 2F" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="City" value={city} onChange={e => setCity(e.target.value)} placeholder="Chicago" />
        <Input label="ZIP code" value={zip} onChange={e => setZip(e.target.value)} placeholder="60629" maxLength={5} />
      </div>
      <Input label="County (optional)" value={county} onChange={e => setCounty(e.target.value)} placeholder="Cook" />
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button
          onClick={() => onNext({ address: street.trim(), apartment_number: apt.trim(), city: city.trim(), zip_code: zip.trim(), county: county.trim() })}
          disabled={!canContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
