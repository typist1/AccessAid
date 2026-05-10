const TYPES = [
  { value: 'drivers_license', label: "Driver's License / State ID" },
  { value: 'passport', label: 'Passport' },
  { value: 'social_security_card', label: 'Social Security Card' },
  { value: 'w2', label: 'W-2 / Tax Return' },
  { value: 'pay_stub', label: 'Pay Stub' },
  { value: 'birth_certificate', label: 'Birth Certificate' },
  { value: 'utility_bill', label: 'Utility Bill' },
  { value: 'lease_agreement', label: 'Lease Agreement' },
  { value: 'benefit_letter', label: 'Benefit Letter / Award Letter' },
]

export default function DocumentTypePicker({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Document Type</label>
      <div className="grid grid-cols-1 gap-2">
        {TYPES.map(t => (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`text-left px-4 py-3 rounded-lg border-2 text-sm transition-colors ${value === t.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
