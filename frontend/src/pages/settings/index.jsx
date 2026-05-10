import { useState } from 'react'
import supabase from '../../lib/supabase'
import { useAuthContext } from '../../context/AuthContext'
import { useUserContext } from '../../context/UserContext'
import { useLanguage } from '../../context/LanguageContext'
import { signOut } from '../../lib/auth'
import { useToast } from '../../components/ui/Toast'
import Sidebar from '../../components/layout/Sidebar'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

// Human-readable labels for every known fact key
const FACT_LABELS = {
  first_name: 'First name',
  last_name: 'Last name',
  full_name: 'Full name',
  date_of_birth: 'Date of birth',
  age: 'Age',
  gender: 'Gender',
  marital_status: 'Marital status',
  ssn_last4: 'SSN (last 4)',
  address: 'Street address',
  apartment_number: 'Apt / Unit',
  city: 'City',
  state: 'State',
  zip_code: 'ZIP code',
  county: 'County',
  phone_cell: 'Cell phone',
  phone_home: 'Home phone',
  phone_work: 'Work phone',
  phone: 'Phone',
  email: 'Email',
  citizenship_status: 'Citizenship',
  us_arrival_date: 'US arrival date',
  alien_registration_number: 'Alien registration #',
  employment_status: 'Employment',
  employer_name: 'Employer',
  employer_address: 'Employer address',
  employer_phone: 'Employer phone',
  employer_ein: 'Employer EIN',
  hours_per_week: 'Hours / week',
  pay_frequency: 'Pay frequency',
  gross_wages: 'Gross wages',
  net_income: 'Net pay',
  ytd_gross: 'YTD gross',
  monthly_income_current: 'Monthly income',
  annual_income_last_year: 'Annual income (last year)',
  income: 'Income bracket',
  federal_tax_withheld: 'Federal tax withheld',
  social_security_withheld: 'SS tax withheld',
  medicare_withheld: 'Medicare withheld',
  household_size: 'Household size',
  has_children: 'Has children',
  children_count: 'Children',
  pregnant: 'Pregnant',
  due_date: 'Due date',
  babies_expected: 'Babies expected',
  disability_status: 'Disability',
  student_status: 'Student',
  is_veteran: 'Veteran',
  monthly_rent: 'Monthly rent',
  heating_included: 'Heat included in rent',
  language_preference: 'Language',
  // Document-extracted
  license_number: 'License #',
  expiration_date: 'Expiration date',
  passport_number: 'Passport #',
  nationality: 'Nationality',
  place_of_birth: 'Place of birth',
  utility_provider: 'Utility provider',
  service_address: 'Service address',
  account_number: 'Account #',
  amount_due: 'Amount due',
  due_date_bill: 'Bill due date',
  landlord_name: 'Landlord',
  landlord_phone: 'Landlord phone',
  property_address: 'Property address',
  lease_start_date: 'Lease start',
  lease_end_date: 'Lease end',
  security_deposit: 'Security deposit',
  program_name: 'Program',
  benefit_amount: 'Benefit amount',
  benefit_frequency: 'Benefit frequency',
  effective_date: 'Effective date',
  case_number: 'Case #',
  agency_name: 'Agency',
}

// Groups for the facts display (keys not matched go into "Other")
const FACT_GROUPS = [
  { label: 'Personal', keys: ['first_name','last_name','full_name','date_of_birth','age','gender','marital_status','ssn_last4','place_of_birth','nationality'] },
  { label: 'Contact', keys: ['phone_cell','phone_home','phone_work','phone','email'] },
  { label: 'Address', keys: ['address','apartment_number','city','state','zip_code','county'] },
  { label: 'Household', keys: ['household_size','has_children','children_count','pregnant','due_date','babies_expected'] },
  { label: 'Citizenship', keys: ['citizenship_status','us_arrival_date','alien_registration_number'] },
  { label: 'Employment', keys: ['employment_status','employer_name','employer_address','employer_phone','employer_ein','hours_per_week','pay_frequency'] },
  { label: 'Income', keys: ['monthly_income_current','annual_income_last_year','income','gross_wages','net_income','ytd_gross','federal_tax_withheld','social_security_withheld','medicare_withheld'] },
  { label: 'Housing', keys: ['monthly_rent','heating_included','property_address','landlord_name','landlord_phone','lease_start_date','lease_end_date','security_deposit'] },
  { label: 'Health & Status', keys: ['disability_status','student_status','is_veteran'] },
  { label: 'Benefits', keys: ['program_name','benefit_amount','benefit_frequency','effective_date','case_number','agency_name'] },
  { label: 'Language', keys: ['language_preference'] },
]

const VALUE_MAPS = {
  citizenship_status: { citizen: 'U.S. Citizen', permanent_resident: 'Permanent Resident', visa: 'Visa Holder', undocumented: 'Undocumented', prefer_not_to_say: 'Prefer not to say' },
  employment_status: { employed: 'Employed (full-time)', 'part-time': 'Employed (part-time)', unemployed: 'Unemployed', retired: 'Retired', student: 'Student', 'self-employed': 'Self-employed' },
  disability_status: { yes: 'Yes', no: 'No', prefer_not_to_say: 'Prefer not to say' },
  student_status: { yes_full_time: 'Full-time student', yes_part_time: 'Part-time student', no: 'No' },
  income: { '<15k': 'Under $15k / yr', '15-30k': '$15k – $30k / yr', '30-50k': '$30k – $50k / yr', '50k+': 'Over $50k / yr' },
  language_preference: { en: 'English', es: 'Español' },
  marital_status: { single: 'Single', married: 'Married', separated: 'Separated', divorced: 'Divorced', widowed: 'Widowed' },
  heating_included: { yes: 'Yes', no: 'No' },
  pregnant: { yes: 'Yes', no: 'No', prefer_not_to_say: 'Prefer not to say' },
  has_children: { 'true': 'Yes', 'false': 'No' },
  is_veteran: { 'true': 'Yes', 'false': 'No' },
}

const MONEY_KEYS = new Set(['monthly_income_current','annual_income_last_year','gross_wages','net_income','ytd_gross','federal_tax_withheld','monthly_rent','benefit_amount','security_deposit','amount_due'])

function formatValue(key, val) {
  if (val === null || val === undefined || val === '') return null
  if (val === true || val === 'true') return 'Yes'
  if (val === false || val === 'false') return 'No'
  const mapped = VALUE_MAPS[key]?.[val]
  if (mapped) return mapped
  if (MONEY_KEYS.has(key)) {
    const n = parseFloat(val)
    if (!isNaN(n)) return `$${n.toLocaleString()}`
  }
  if (key === 'hours_per_week') return `${val} hrs`
  return String(val)
}

const FACT_INPUT_CONFIG = {
  employment_status: { type: 'select', options: ['employed', 'unemployed', 'part-time', 'retired', 'student', 'self-employed'] },
  citizenship_status: { type: 'select', options: ['citizen', 'permanent_resident', 'visa', 'undocumented', 'prefer_not_to_say'] },
  disability_status: { type: 'select', options: ['yes', 'no', 'prefer_not_to_say'] },
  student_status: { type: 'select', options: ['yes_full_time', 'yes_part_time', 'no'] },
  has_children: { type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
  pregnant: { type: 'select', options: ['yes', 'no', 'prefer_not_to_say'] },
  is_veteran: { type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
  language_preference: { type: 'select', options: [{ value: 'en', label: 'English' }, { value: 'es', label: 'Español' }] },
  state: { type: 'select', options: US_STATES },
  age: { type: 'number', min: 0, max: 120 },
  household_size: { type: 'number', min: 1, max: 20 },
  children_count: { type: 'number', min: 0, max: 20 },
  monthly_income_current: { type: 'number', min: 0 },
  annual_income_last_year: { type: 'number', min: 0 },
  monthly_rent: { type: 'number', min: 0 },
  hours_per_week: { type: 'number', min: 0, max: 168 },
  zip_code: { type: 'text' },
}

// Profile fields shown in the view card (cleaner labels, no verbose translations)
const PROFILE_DISPLAY = [
  { key: 'full_name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'state', label: 'State' },
  { key: 'employment_status', label: 'Employment' },
  { key: 'monthly_income_current', label: 'Monthly income' },
  { key: 'household_size', label: 'Household size' },
  { key: 'citizenship_status', label: 'Citizenship' },
  { key: 'has_children', label: 'Has children' },
  { key: 'children_count', label: 'Children' },
  { key: 'disability_status', label: 'Disability' },
  { key: 'pregnant', label: 'Pregnant' },
  { key: 'student_status', label: 'Student' },
  { key: 'is_veteran', label: 'Veteran' },
  { key: 'language_preference', label: 'Language' },
]

// For profile edit form
const PROFILE_EDIT_FIELDS = [
  { key: 'full_name', label: 'Full name', type: 'text' },
  { key: 'age', label: 'Age', type: 'number', min: 18, max: 120 },
  { key: 'state', label: 'State', type: 'select', options: US_STATES },
  { key: 'employment_status', label: 'Employment', type: 'select', options: ['employed', 'unemployed', 'part-time', 'retired', 'student', 'self-employed'] },
  { key: 'monthly_income_current', label: 'Monthly income ($)', type: 'number', min: 0 },
  { key: 'household_size', label: 'Household size', type: 'number', min: 1, max: 20 },
  { key: 'citizenship_status', label: 'Citizenship', type: 'select', options: ['citizen', 'permanent_resident', 'visa', 'undocumented', 'prefer_not_to_say'] },
  { key: 'has_children', label: 'Has children', type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
  { key: 'children_count', label: 'Number of children', type: 'number', min: 0, max: 20 },
  { key: 'disability_status', label: 'Disability', type: 'select', options: ['yes', 'no', 'prefer_not_to_say'] },
  { key: 'pregnant', label: 'Pregnant', type: 'select', options: ['yes', 'no', 'prefer_not_to_say'] },
  { key: 'student_status', label: 'Student status', type: 'select', options: ['yes_full_time', 'yes_part_time', 'no'] },
  { key: 'is_veteran', label: 'Veteran', type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
  { key: 'language_preference', label: 'Language', type: 'select', options: [{ value: 'en', label: 'English' }, { value: 'es', label: 'Español' }] },
]

function FactRow({ fact, onSave }) {
  const config = FACT_INPUT_CONFIG[fact.field_key]
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(fact.field_value)
  const [saving, setSaving] = useState(false)

  const label = FACT_LABELS[fact.field_key] ?? fact.field_key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const display = formatValue(fact.field_key, fact.field_value)
  const isObjectOptions = config?.options?.length > 0 && typeof config.options[0] === 'object'

  async function save() {
    setSaving(true)
    await supabase.from('user_facts').update({ field_value: val }).eq('id', fact.id)
    onSave()
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
        {editing ? (
          <div className="flex items-center gap-2 mt-1">
            {config?.type === 'select' ? (
              <select
                value={val}
                onChange={e => setVal(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isObjectOptions
                  ? config.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
                  : config.options.map(o => <option key={o} value={o}>{o}</option>)
                }
              </select>
            ) : (
              <input
                type={config?.type ?? 'text'}
                value={val}
                min={config?.min}
                max={config?.max}
                onChange={e => setVal(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            )}
            <button
              onClick={save}
              disabled={saving}
              className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md disabled:opacity-50 shrink-0"
            >
              Save
            </button>
            <button
              onClick={() => { setEditing(false); setVal(fact.field_value) }}
              className="text-xs text-gray-500 hover:text-gray-700 shrink-0"
            >
              Cancel
            </button>
          </div>
        ) : (
          <p className="text-gray-900 text-sm font-medium">{display ?? <span className="text-gray-400 italic">—</span>}</p>
        )}
      </div>
      {!editing && (
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-blue-500 hover:text-blue-700 shrink-0 mt-0.5"
        >
          Edit
        </button>
      )}
    </div>
  )
}

export default function Settings() {
  const { setLanguage } = useLanguage()
  const { user } = useAuthContext()
  const { profile, facts, fetchFacts, fetchProfile } = useUserContext()
  const { toast } = useToast()

  const [editing, setEditing] = useState(false)
  const [editValues, setEditValues] = useState({})
  const [savingProfile, setSavingProfile] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deletingFacts, setDeletingFacts] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

  function startEdit() {
    const vals = {}
    PROFILE_EDIT_FIELDS.forEach(({ key }) => {
      const v = profile?.[key]
      vals[key] = (v === true || v === false) ? String(v) : (v ?? '')
    })
    setEditValues(vals)
    setEditing(true)
  }

  async function saveProfile() {
    setSavingProfile(true)
    try {
      const updates = {}
      PROFILE_EDIT_FIELDS.forEach(({ key, type }) => {
        const v = editValues[key]
        if (v === '' || v === null || v === undefined) return
        if (type === 'number') {
          updates[key] = ['age', 'household_size', 'children_count'].includes(key) ? parseInt(v) : parseFloat(v)
        } else if (v === 'true') { updates[key] = true
        } else if (v === 'false') { updates[key] = false
        } else { updates[key] = v }
      })

      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      await fetchProfile()
      await fetchFacts()
      setEditing(false)
      toast('Profile saved', 'success')
      if (updates.language_preference) setLanguage(updates.language_preference)

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/eligibility/score`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).catch(console.error)
    } catch (e) {
      toast(`Save failed: ${e.message}`, 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleDeleteFacts() {
    if (!window.confirm('Delete all stored facts? This cannot be undone.')) return
    setDeletingFacts(true)
    await supabase.from('user_facts').delete().eq('user_id', user.id)
    await fetchFacts()
    setDeletingFacts(false)
    toast('Stored facts deleted', 'success')
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE') return
    setDeletingAccount(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      await signOut()
    } catch (e) {
      toast(`Error: ${e.message}`, 'error')
      setDeletingAccount(false)
    }
  }

  // Build grouped facts, then collect any ungrouped ones
  const factsMap = Object.fromEntries(facts.map(f => [f.field_key, f]))
  const groupedKeys = new Set(FACT_GROUPS.flatMap(g => g.keys))
  const otherFacts = facts.filter(f => !groupedKeys.has(f.field_key))

  const visibleGroups = FACT_GROUPS
    .map(g => ({ ...g, items: g.keys.map(k => factsMap[k]).filter(Boolean) }))
    .filter(g => g.items.length > 0)

  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

        {/* Profile card */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 text-lg">Your Profile</h2>
            {!editing && profile && (
              <Button variant="secondary" onClick={startEdit}>Edit</Button>
            )}
          </div>

          {editing ? (
            <div className="flex flex-col gap-4">
              {PROFILE_EDIT_FIELDS.map(field => {
                const opts = field.options ?? []
                const isObj = opts.length > 0 && typeof opts[0] === 'object'
                const cls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                return (
                  <div key={field.key}>
                    <label className="text-sm font-medium text-gray-700 block mb-1">{field.label}</label>
                    {field.type === 'select' ? (
                      <select value={editValues[field.key] ?? ''} onChange={e => setEditValues(p => ({ ...p, [field.key]: e.target.value }))} className={cls}>
                        <option value="">— select —</option>
                        {isObj ? opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>) : opts.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={field.type} value={editValues[field.key] ?? ''} min={field.min} max={field.max} onChange={e => setEditValues(p => ({ ...p, [field.key]: e.target.value }))} className={cls} />
                    )}
                  </div>
                )
              })}
              <div className="flex gap-3 mt-2">
                <Button onClick={saveProfile} disabled={savingProfile}>{savingProfile ? 'Saving…' : 'Save'}</Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : profile ? (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {PROFILE_DISPLAY.map(({ key, label }) => {
                const raw = profile[key]
                const display = formatValue(key, raw)
                if (!display) return null
                return (
                  <div key={key}>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">{label}</p>
                    <p className="text-gray-900 text-sm font-medium">{display}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No profile found.</p>
          )}
        </Card>

        {/* Stored facts card */}
        <Card>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-gray-900 text-lg">Stored Facts</h2>
            <span className="text-sm text-gray-400">{facts.length} fields</span>
          </div>
          <p className="text-sm text-gray-500 mb-5">Used to auto-fill your applications. Built from onboarding, uploaded documents, and forms you've filled out.</p>

          {facts.length === 0 ? (
            <p className="text-gray-400 text-sm">No facts stored yet.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {visibleGroups.map(group => (
                <div key={group.label}>
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-widest mb-1">{group.label}</p>
                  <div className="divide-y divide-gray-100">
                    {group.items.map(f => (
                      <FactRow key={f.id} fact={f} onSave={fetchFacts} />
                    ))}
                  </div>
                </div>
              ))}
              {otherFacts.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Other</p>
                  <div className="divide-y divide-gray-100">
                    {otherFacts.map(f => (
                      <FactRow key={f.id} fact={f} onSave={fetchFacts} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Button
              variant="danger"
              onClick={handleDeleteFacts}
              disabled={deletingFacts || facts.length === 0}
            >
              {deletingFacts ? 'Deleting…' : 'Delete all stored facts'}
            </Button>
          </div>
        </Card>

        {/* Account card */}
        <Card>
          <h2 className="font-semibold text-gray-900 text-lg mb-2">Account</h2>
          <p className="text-sm text-gray-600 mb-5">
            Signed in as <span className="font-medium text-gray-900">{user?.email}</span>
          </p>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="font-medium text-red-700 mb-1">Delete account</h3>
            <p className="text-sm text-gray-500 mb-3">Permanently deletes your profile, all stored facts, and documents. Cannot be undone.</p>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Type DELETE to confirm</label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 w-full focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <Button variant="danger" onClick={handleDeleteAccount} disabled={deleteConfirm !== 'DELETE' || deletingAccount}>
              {deletingAccount ? 'Deleting…' : 'Delete my account'}
            </Button>
          </div>
        </Card>
      </div>
    </Sidebar>
  )
}
