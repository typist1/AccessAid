import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserContext } from '../../context/UserContext'
import Sidebar from '../../components/layout/Sidebar'
import ChatPanel from '../../components/chat/ChatPanel'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

const ABE_SECTIONS = [
  {
    title: 'Personal',
    fields: [
      { key: 'first_name', label: 'First Name', type: 'text' },
      { key: 'last_name', label: 'Last Name', type: 'text' },
      { key: 'date_of_birth', label: 'Date of Birth', type: 'date' },
      { key: 'ssn_last4', label: 'Last 4 of SSN', type: 'text' },
    ],
  },
  {
    title: 'Contact',
    fields: [
      { key: 'address_line_1', label: 'Street Address', type: 'text' },
      { key: 'city', label: 'City', type: 'text' },
      {
        key: 'state', label: 'State', type: 'select',
        options: US_STATES.map(s => ({ value: s, label: s })),
      },
      { key: 'zip_code', label: 'ZIP Code', type: 'text' },
      { key: 'phone_number', label: 'Phone Number', type: 'tel' },
      { key: 'email', label: 'Email', type: 'email' },
    ],
  },
  {
    title: 'Household',
    fields: [
      { key: 'household_size', label: 'Household Size', type: 'number' },
      { key: 'num_children', label: 'Children Under 18', type: 'number' },
    ],
  },
  {
    title: 'Income & Work',
    fields: [
      {
        key: 'employment_status', label: 'Employment Status', type: 'select',
        options: [
          { value: 'employed', label: 'Employed' },
          { value: 'unemployed', label: 'Unemployed' },
          { value: 'part-time', label: 'Part-time' },
          { value: 'self-employed', label: 'Self-employed' },
          { value: 'retired', label: 'Retired' },
          { value: 'student', label: 'Student' },
        ],
      },
      { key: 'monthly_income', label: 'Monthly Income ($)', type: 'number' },
      { key: 'annual_income_last_year', label: 'Annual Income Last Year ($)', type: 'number' },
    ],
  },
  {
    title: 'Eligibility',
    fields: [
      {
        key: 'citizenship_status', label: 'Citizenship Status', type: 'select',
        options: [
          { value: 'citizen', label: 'U.S. Citizen' },
          { value: 'permanent_resident', label: 'Permanent Resident' },
          { value: 'visa', label: 'Visa Holder' },
          { value: 'prefer_not_to_say', label: 'Prefer not to say' },
        ],
      },
      {
        key: 'disability_status', label: 'Disability Status', type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'prefer_not_to_say', label: 'Prefer not to say' },
        ],
      },
      {
        key: 'pregnant', label: 'Currently Pregnant', type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
    ],
  },
]

const ALL_FIELDS = ABE_SECTIONS.flatMap(s => s.fields)

function getFactValue(facts, key) {
  return facts.find(f => f.field_key === key)?.field_value ?? null
}

function FieldRow({ fieldDef, value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)

  function startEdit() {
    setDraft(value ?? '')
    setEditing(true)
  }

  async function save() {
    if (!draft && draft !== '0') return
    setSaving(true)
    await onSave(fieldDef.key, draft)
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {fieldDef.label}
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded-full font-medium"
            style={{ background: '#fef3c7', color: '#92400e' }}
          >
            ABE.illinois.gov
          </span>
        </div>

        {editing ? (
          <div className="flex items-center gap-2 mt-1">
            {fieldDef.type === 'select' ? (
              <select
                value={draft}
                onChange={e => setDraft(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              >
                <option value="">— select —</option>
                {fieldDef.options.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={fieldDef.type}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
                className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            )}
            <button
              onClick={save}
              disabled={saving}
              className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg disabled:opacity-50 shrink-0"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-gray-500 hover:text-gray-700 shrink-0"
            >
              Cancel
            </button>
          </div>
        ) : (
          <p className={`text-sm mt-0.5 ${value ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            {value ?? '—'}
          </p>
        )}
      </div>

      {!editing && (
        <button
          onClick={startEdit}
          className="text-xs text-blue-500 hover:text-blue-700 shrink-0 mt-0.5 font-medium"
        >
          {value ? 'Edit' : 'Add'}
        </button>
      )}
    </div>
  )
}

function FieldSection({ section, facts, onSave }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100" style={{ background: '#f9f5ff' }}>
        <h2 className="text-sm font-semibold" style={{ color: '#2d1659' }}>{section.title}</h2>
      </div>
      <div className="px-5">
        {section.fields.map(f => (
          <FieldRow
            key={f.key}
            fieldDef={f}
            value={getFactValue(facts, f.key)}
            onSave={onSave}
          />
        ))}
      </div>
    </div>
  )
}

export default function AbeAutofillPage() {
  const { facts, upsertFact } = useUserContext()
  const [saved, setSaved] = useState(null)

  async function handleSave(key, value) {
    await upsertFact(key, value, 'manual')
    setSaved(key)
    setTimeout(() => setSaved(null), 2000)
  }

  const filled = ALL_FIELDS.filter(f => getFactValue(facts, f.key)).length
  const total = ALL_FIELDS.length

  const programContext = 'Program: SNAP (Food Stamps)\nThis is an Illinois ABE application for SNAP food benefits. Help the user understand eligibility requirements and what information they need to provide.'

  return (
    <Sidebar>
      <div className="flex h-[calc(100vh-0px)]">
        <div className="flex-1 overflow-y-auto p-6">
          <Link to="/programs/snap" className="text-sm text-blue-600 hover:underline">← Back to Program</Link>

          <div className="max-w-2xl mx-auto mt-4 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">SNAP Application — Autofill Profile</h1>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Profile complete</span>
                <span className="text-sm font-semibold" style={{ color: '#2d1659' }}>
                  {filled} / {total} fields
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-blue-600"
                  style={{ width: `${Math.round((filled / total) * 100)}%` }}
                />
              </div>
            </div>

            {/* Info banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
              Fill in your profile below, then click <strong>Open ABE.illinois.gov</strong> — the AccessAid Chrome extension will autofill highlighted fields automatically.
            </div>

            {/* Field sections */}
            {ABE_SECTIONS.map(section => (
              <FieldSection
                key={section.title}
                section={section}
                facts={facts}
                onSave={handleSave}
              />
            ))}

            {/* CTA */}
            <div className="flex gap-3 pb-6">
              <a
                href="https://abe.illinois.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Open ABE.illinois.gov →
              </a>
            </div>
          </div>
        </div>

        <div className="w-96 shrink-0 border-l border-gray-200 flex flex-col">
          <ChatPanel programName="SNAP (Food Stamps)" programContext={programContext} />
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg z-50">
          Saved ✓
        </div>
      )}
    </Sidebar>
  )
}
