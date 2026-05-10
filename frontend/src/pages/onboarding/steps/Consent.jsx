import { useState } from 'react'
import Button from '../../../components/ui/Button'

export default function Consent({ value, onNext, onBack, saving }) {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Privacy & Consent</h2>
        <p className="text-gray-500 mt-1">Please review how we handle your data.</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
        <p>Your privacy is protected:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Your data is encrypted in storage and in transit</li>
          <li>We only extract key information from documents — not the documents themselves</li>
          <li>Original files are automatically deleted within 24 hours of upload</li>
          <li>We never sell or share your data</li>
          <li>You can delete your data at any time in Settings</li>
          <li>We store only the last 4 digits of any Social Security number</li>
        </ul>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 text-blue-600 rounded border-gray-300"
        />
        <span className="text-sm text-gray-700">
          I understand and agree to the privacy terms above. I consent to AccessAid storing my information to help find eligible programs.
        </span>
      </label>

      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button onClick={() => onNext({ consent: true })} disabled={!agreed || saving}>
          {saving ? 'Saving your profile...' : 'Find my programs'}
        </Button>
      </div>
    </div>
  )
}
