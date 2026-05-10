import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function Children({ value, onNext, onBack }) {
  const [hasChildren, setHasChildren] = useState(value.has_children ?? '')
  const [count, setCount] = useState(value.children_count ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Do you have any children under 18?</h2>
      </div>
      <div className="flex gap-3">
        {['yes', 'no'].map(opt => (
          <button
            key={opt}
            onClick={() => setHasChildren(opt)}
            className={`flex-1 py-3 rounded-lg border-2 capitalize font-medium transition-colors ${hasChildren === opt ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {hasChildren === 'yes' && (
        <Input label="How many?" type="number" min="1" max="20" value={count} onChange={e => setCount(e.target.value)} placeholder="2" autoFocus />
      )}
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button
          onClick={() => onNext({ has_children: hasChildren, children_count: hasChildren === 'yes' ? count : '0' })}
          disabled={!hasChildren || (hasChildren === 'yes' && !count)}
        >Continue</Button>
      </div>
    </div>
  )
}
