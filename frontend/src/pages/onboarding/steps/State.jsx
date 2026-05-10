import { useState } from 'react'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'

const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']

export default function State({ value, onNext, onBack }) {
  const [state, setState] = useState(value.state ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Which state do you live in?</h2>
        <p className="text-gray-500 mt-1">Many programs are state-specific.</p>
      </div>
      <Select
        label="State"
        value={state}
        onChange={e => setState(e.target.value)}
        options={[{ value: '', label: 'Select a state' }, ...STATES.map(s => ({ value: s, label: s }))]}
      />
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>Back</Button>}
        <Button onClick={() => onNext({ state })} disabled={!state}>Continue</Button>
      </div>
    </div>
  )
}
