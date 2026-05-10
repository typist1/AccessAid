import { useState, useEffect } from 'react'
import { useUserContext } from '../../context/UserContext'
import { mapFactsToForm } from '../../lib/autofill'
import FormField from './FormField'
import ProgressBar from '../ui/ProgressBar'
import Button from '../ui/Button'

export default function FormRenderer({ schema, onStatusChange }) {
  const { facts } = useUserContext()
  const [values, setValues] = useState({})
  const [autofilledKeys, setAutofilledKeys] = useState(new Set())
  const [sectionIdx, setSectionIdx] = useState(0)
  const [validationErrors, setValidationErrors] = useState([])

  useEffect(() => {
    if (!schema || !facts.length) return
    const allFields = schema.sections.flatMap(s => s.fields)
    const autofilled = mapFactsToForm(allFields, facts)
    setAutofilledKeys(new Set(Object.keys(autofilled)))
    setValues(prev => {
      const next = { ...prev }
      for (const [k, v] of Object.entries(autofilled)) {
        if (!next[k]) next[k] = v
      }
      return next
    })
  }, [facts, schema])

  if (!schema) return null

  const section = schema.sections[sectionIdx]

  function validateSection() {
    const missing = section.fields
      .filter(f => f.required && !values[f.id])
      .map(f => f.label)
    return missing
  }

  function handleChange(id, val) {
    setValues(prev => ({ ...prev, [id]: val }))
    if (validationErrors.length) setValidationErrors([])
  }

  function handleNext() {
    const missing = validateSection()
    if (missing.length) { setValidationErrors(missing); return }
    setValidationErrors([])
    setSectionIdx(i => i + 1)
  }

  function handleSubmit() {
    const missing = validateSection()
    if (missing.length) { setValidationErrors(missing); return }
    onStatusChange?.('submitted')
  }

  const fieldsWithMeta = section.fields.map(f => ({
    ...f,
    _autofilled: autofilledKeys.has(f.id),
  }))

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar
        value={sectionIdx + 1}
        max={schema.sections.length}
        label={`Section ${sectionIdx + 1} of ${schema.sections.length} — ${section.title}`}
      />

      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-gray-900">{section.title}</h3>
        {fieldsWithMeta.map(field => (
          <FormField
            key={field.id}
            field={field}
            value={values[field.id] ?? ''}
            onChange={handleChange}
          />
        ))}
      </div>

      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          <p className="font-medium mb-1">Please fill in required fields:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {validationErrors.map(f => <li key={f}>{f}</li>)}
          </ul>
        </div>
      )}

      <div className="flex gap-3 justify-between">
        {sectionIdx > 0 && (
          <Button variant="ghost" onClick={() => { setSectionIdx(i => i - 1); setValidationErrors([]) }}>
            Back
          </Button>
        )}
        <div className="flex gap-3 ml-auto">
          {sectionIdx < schema.sections.length - 1 ? (
            <Button onClick={handleNext}>Next Section</Button>
          ) : (
            <Button onClick={handleSubmit}>Mark as Submitted</Button>
          )}
        </div>
      </div>
    </div>
  )
}
