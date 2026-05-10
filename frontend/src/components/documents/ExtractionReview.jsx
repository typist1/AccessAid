import { useState } from 'react'
import Button from '../ui/Button'

export default function ExtractionReview({ facts, onConfirm, onCancel }) {
  const [edited, setEdited] = useState(facts)

  function handleChange(key, val) {
    setEdited(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-semibold text-gray-900">We found these details</h3>
        <p className="text-sm text-gray-600 mt-1">Review and correct anything that looks wrong before saving.</p>
      </div>

      <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
        {Object.entries(edited).map(([key, val]) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{key.replace(/_/g, ' ')}</label>
            <input
              value={val}
              onChange={e => handleChange(key, e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      {Object.keys(edited).length === 0 && (
        <p className="text-sm text-gray-500">No information could be extracted from this document.</p>
      )}

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onConfirm(edited)} disabled={Object.keys(edited).length === 0}>
          Save to Profile
        </Button>
      </div>
    </div>
  )
}
