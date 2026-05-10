import { useUserContext } from '../../context/UserContext'
import { useToast } from '../ui/Toast'

export default function FormField({ field, value, onChange }) {
  const { upsertFact } = useUserContext()
  const { toast } = useToast()
  const isAutofilled = field._autofilled && value !== ''
  const isEmpty = field.required && !value

  async function handleBlur() {
    if (value) {
      await upsertFact(field.id, value, 'form')
    }
  }

  const baseClass = 'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
  const bgClass = isAutofilled
    ? 'bg-blue-50 border-blue-300'
    : isEmpty
    ? 'bg-yellow-50 border-yellow-300'
    : 'bg-white border-gray-300'

  const labelRow = (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {isAutofilled && (
        <span className="text-xs text-blue-600 font-medium">Auto-filled</span>
      )}
      {isEmpty && !isAutofilled && (
        <span className="text-xs text-yellow-600 font-medium">Required</span>
      )}
    </div>
  )

  if (field.type === 'select') {
    return (
      <div className="flex flex-col gap-1">
        {labelRow}
        <select
          value={value ?? ''}
          onChange={e => onChange(field.id, e.target.value)}
          onBlur={handleBlur}
          className={`${baseClass} ${bgClass}`}
        >
          <option value="">— Select —</option>
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {labelRow}
      <input
        type={field.type ?? 'text'}
        value={value ?? ''}
        onChange={e => onChange(field.id, e.target.value)}
        onBlur={handleBlur}
        maxLength={field.maxLength}
        className={`${baseClass} ${bgClass}`}
        placeholder={isAutofilled ? '' : `Enter ${field.label.toLowerCase()}`}
      />
    </div>
  )
}
