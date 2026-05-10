import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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

const FACT_INPUT_CONFIG = {
  employment_status: {
    type: 'select',
    options: ['employed', 'unemployed', 'part-time', 'retired', 'student'],
  },
  citizenship_status: {
    type: 'select',
    options: ['citizen', 'permanent_resident', 'visa', 'undocumented', 'prefer_not_to_say'],
  },
  disability_status: {
    type: 'select',
    options: ['yes', 'no', 'prefer_not_to_say'],
  },
  student_status: {
    type: 'select',
    options: ['yes_full_time', 'yes_part_time', 'no'],
  },
  has_children: { type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
  pregnant: { type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
  is_veteran: { type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
  language_preference: {
    type: 'select',
    options: [{ value: 'en', label: 'English' }, { value: 'es', label: 'Español' }],
  },
  state: { type: 'select', options: US_STATES },
  age: { type: 'number', min: 18, max: 120, validate: v => { const n=parseInt(v); return (isNaN(n)||n<18||n>120)?'18–120':null } },
  household_size: { type: 'number', min: 1, max: 20, validate: v => { const n=parseInt(v); return (isNaN(n)||n<1||n>20)?'1–20':null } },
  num_children: { type: 'number', min: 0, max: 20, validate: v => { const n=parseInt(v); return (isNaN(n)||n<0||n>20)?'0–20':null } },
  monthly_income_current: { type: 'number', min: 0, validate: v => parseFloat(v)<0?'≥ 0':null },
  annual_income_last_year: { type: 'number', min: 0, validate: v => parseFloat(v)<0?'≥ 0':null },
  zip_code: { type: 'text', validate: v => !/^\d{5}$/.test(v)?'5 digits':null },
}

function ProfileField({ field, value, error, onChange }) {
  const inputClass = `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
    error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
  }`

  const opts = field.options ?? []
  const isObjectOptions = opts.length > 0 && typeof opts[0] === 'object'

  return (
    <div>
      <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">{field.label}</label>
      {field.type === 'select' ? (
        <select value={value ?? ''} onChange={e => onChange(e.target.value)} className={inputClass}>
          <option value="">— select —</option>
          {isObjectOptions
            ? opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
            : opts.map(o => <option key={o} value={o}>{o}</option>)
          }
        </select>
      ) : (
        <input
          type={field.type}
          value={value ?? ''}
          min={field.min}
          max={field.max}
          onChange={e => onChange(e.target.value)}
          className={inputClass}
        />
      )}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}

export default function Settings() {
  const { t } = useTranslation()
  const { setLanguage } = useLanguage()
  const { user } = useAuthContext()
  const { profile, facts, fetchFacts, fetchProfile } = useUserContext()
  const { toast } = useToast()

  const PROFILE_FIELDS = [
    {
      key: 'full_name', label: t('settings.field_full_name'), type: 'text',
      validate: v => (!v || String(v).trim().length < 2) ? t('settings.validation_name') : null,
    },
    {
      key: 'age', label: t('settings.field_age'), type: 'number', min: 18, max: 120,
      validate: v => {
        const n = parseInt(v); return (isNaN(n) || n < 18 || n > 120) ? t('settings.validation_age') : null
      },
    },
    {
      key: 'state', label: t('settings.field_state'), type: 'select', options: US_STATES,
      validate: v => !v ? t('settings.validation_state') : null,
    },
    {
      key: 'zip_code', label: t('settings.field_zip_code'), type: 'text',
      validate: v => !/^\d{5}$/.test(String(v ?? '')) ? t('settings.validation_zip') : null,
    },
    {
      key: 'employment_status', label: t('settings.field_employment_status'), type: 'select',
      options: ['employed', 'unemployed', 'part-time', 'retired', 'student'],
      validate: v => !v ? t('settings.validation_employment') : null,
    },
    {
      key: 'monthly_income_current', label: t('settings.field_monthly_income'), type: 'number', min: 0,
      validate: v => (v === '' || v === null || v === undefined || parseFloat(v) < 0) ? t('settings.validation_income_current') : null,
    },
    {
      key: 'annual_income_last_year', label: t('settings.field_annual_income'), type: 'number', min: 0,
      validate: v => (v === '' || v === null || v === undefined || parseFloat(v) < 0) ? t('settings.validation_income_annual') : null,
    },
    {
      key: 'household_size', label: t('settings.field_household_size'), type: 'number', min: 1, max: 20,
      validate: v => { const n = parseInt(v); return (isNaN(n) || n < 1 || n > 20) ? t('settings.validation_household') : null },
    },
    {
      key: 'citizenship_status', label: t('settings.field_citizenship_status'), type: 'select',
      options: ['citizen', 'permanent_resident', 'visa', 'undocumented', 'prefer_not_to_say'],
      validate: v => !v ? t('settings.validation_citizenship') : null,
    },
    {
      key: 'has_children', label: t('settings.field_has_children'), type: 'select',
      options: [{ value: 'true', label: t('common.yes') }, { value: 'false', label: t('common.no') }],
      validate: v => (v === '' || v === null || v === undefined) ? t('settings.validation_has_children') : null,
    },
    {
      key: 'num_children', label: t('settings.field_num_children'), type: 'number', min: 0, max: 20,
      validate: v => { const n = parseInt(v); return (isNaN(n) || n < 0 || n > 20) ? t('settings.validation_num_children') : null },
    },
    {
      key: 'disability_status', label: t('settings.field_disability_status'), type: 'select',
      options: ['yes', 'no', 'prefer_not_to_say'],
      validate: v => !v ? t('settings.validation_disability') : null,
    },
    {
      key: 'pregnant', label: t('settings.field_pregnant'), type: 'select',
      options: [{ value: 'true', label: t('common.yes') }, { value: 'false', label: t('common.no') }],
      validate: v => (v === '' || v === null || v === undefined) ? t('settings.validation_pregnant') : null,
    },
    {
      key: 'student_status', label: t('settings.field_student_status'), type: 'select',
      options: ['yes_full_time', 'yes_part_time', 'no'],
      validate: v => !v ? t('settings.validation_student') : null,
    },
    {
      key: 'is_veteran', label: t('settings.field_is_veteran'), type: 'select',
      options: [{ value: 'true', label: t('common.yes') }, { value: 'false', label: t('common.no') }],
      validate: v => (v === '' || v === null || v === undefined) ? t('settings.validation_veteran') : null,
    },
    {
      key: 'language_preference', label: t('settings.field_language'), type: 'select',
      options: [{ value: 'en', label: 'English' }, { value: 'es', label: 'Español' }],
      validate: v => !v ? t('settings.validation_language') : null,
    },
  ]

  const [editing, setEditing] = useState(false)
  const [editValues, setEditValues] = useState({})
  const [profileErrors, setProfileErrors] = useState({})
  const [savingProfile, setSavingProfile] = useState(false)

  const [editingFactId, setEditingFactId] = useState(null)
  const [editingFactValue, setEditingFactValue] = useState('')
  const [factError, setFactError] = useState(null)
  const [savingFact, setSavingFact] = useState(false)

  const [deletingFacts, setDeletingFacts] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deletingAccount, setDeletingAccount] = useState(false)

  function startEdit() {
    const vals = {}
    PROFILE_FIELDS.forEach(({ key }) => {
      const v = profile?.[key]
      vals[key] = (v === true || v === false) ? String(v) : (v ?? '')
    })
    setEditValues(vals)
    setProfileErrors({})
    setEditing(true)
  }

  function validateAll() {
    const errs = {}
    PROFILE_FIELDS.forEach(({ key, validate }) => {
      if (!validate) return
      const err = validate(editValues[key])
      if (err) errs[key] = err
    })
    return errs
  }

  async function saveProfile() {
    const errs = validateAll()
    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs)
      return
    }
    setSavingProfile(true)
    try {
      const updates = {}
      PROFILE_FIELDS.forEach(({ key, type }) => {
        const v = editValues[key]
        if (v === '' || v === null || v === undefined) return
        if (type === 'number') {
          updates[key] = key === 'age' || key === 'household_size' || key === 'num_children'
            ? parseInt(v)
            : parseFloat(v)
        } else if (v === 'true') {
          updates[key] = true
        } else if (v === 'false') {
          updates[key] = false
        } else {
          updates[key] = v
        }
      })

      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(updates),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `HTTP ${res.status}`)
      }

      await fetchProfile()
      await fetchFacts()
      setEditing(false)
      toast(t('settings.toast_saved'), 'success')

      if (updates.language_preference) {
        setLanguage(updates.language_preference)
      }

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/eligibility/score`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).catch(console.error)
    } catch (e) {
      toast(t('settings.toast_save_error', { error: e.message }), 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  function startEditFact(fact) {
    setEditingFactId(fact.id)
    setEditingFactValue(fact.field_value)
    setFactError(null)
  }

  async function saveFactEdit(fact) {
    const config = FACT_INPUT_CONFIG[fact.field_key]
    if (config?.validate) {
      const err = config.validate(editingFactValue)
      if (err) { setFactError(err); return }
    }
    setSavingFact(true)
    await supabase.from('user_facts').update({ field_value: editingFactValue }).eq('id', fact.id)
    await fetchFacts()
    setEditingFactId(null)
    setFactError(null)
    setSavingFact(false)
    toast(t('settings.toast_fact_updated'), 'success')
  }

  async function handleDeleteFacts() {
    if (!window.confirm(t('settings.delete_facts_confirm'))) return
    setDeletingFacts(true)
    await supabase.from('user_facts').delete().eq('user_id', user.id)
    await fetchFacts()
    setDeletingFacts(false)
    toast(t('settings.toast_facts_deleted'), 'success')
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
      toast(t('settings.toast_account_error', { error: e.message }), 'error')
      setDeletingAccount(false)
    }
  }

  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">{t('settings.profile_heading')}</h2>
            {!editing && profile && (
              <Button variant="secondary" onClick={startEdit}>{t('settings.edit_btn')}</Button>
            )}
          </div>

          {editing ? (
            <div className="flex flex-col gap-3">
              {PROFILE_FIELDS.map(field => (
                <ProfileField
                  key={field.key}
                  field={field}
                  value={editValues[field.key]}
                  error={profileErrors[field.key]}
                  onChange={v => {
                    setEditValues(prev => ({ ...prev, [field.key]: v }))
                    if (profileErrors[field.key]) {
                      setProfileErrors(prev => ({ ...prev, [field.key]: null }))
                    }
                  }}
                />
              ))}
              <div className="flex gap-3 mt-2">
                <Button onClick={saveProfile} disabled={savingProfile}>
                  {savingProfile ? t('settings.saving_btn') : t('settings.save_btn')}
                </Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>{t('settings.cancel_btn')}</Button>
              </div>
            </div>
          ) : profile ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {PROFILE_FIELDS.map(({ key, label, options }) => {
                const raw = profile[key]
                let display = '—'
                if (raw !== null && raw !== undefined && raw !== '') {
                  if (raw === true) display = t('common.yes')
                  else if (raw === false) display = t('common.no')
                  else if (Array.isArray(options) && options.length > 0 && typeof options[0] === 'object') {
                    display = options.find(o => o.value === String(raw))?.label ?? String(raw)
                  } else {
                    display = String(raw)
                  }
                }
                return (
                  <div key={key}>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">{label}</p>
                    <p className="text-gray-900">{display}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{t('settings.profile_not_found')}</p>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-900 mb-1">{t('settings.facts_heading', { count: facts.length })}</h2>
          <p className="text-sm text-gray-600 mb-4">{t('settings.facts_subtitle')}</p>
          <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto mb-4">
            {facts.map(f => {
              const config = FACT_INPUT_CONFIG[f.field_key]
              const isEditing = editingFactId === f.id
              const isObjectOptions = config?.options?.length > 0 && typeof config.options[0] === 'object'
              return (
                <div key={f.id} className="border-b border-gray-100 pb-2 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 text-xs uppercase tracking-wide shrink-0">
                      {f.field_key.replace(/_/g, ' ')}
                    </span>
                    {!isEditing && (
                      <button
                        onClick={() => startEditFact(f)}
                        className="text-xs text-blue-500 hover:text-blue-700 shrink-0"
                      >
                        {t('settings.edit_btn')}
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-2">
                        {config?.type === 'select' ? (
                          <select
                            value={editingFactValue}
                            onChange={e => { setEditingFactValue(e.target.value); setFactError(null) }}
                            className={`flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 ${factError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
                          >
                            {isObjectOptions
                              ? config.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
                              : config.options.map(o => <option key={o} value={o}>{o}</option>)
                            }
                          </select>
                        ) : (
                          <input
                            type={config?.type ?? 'text'}
                            value={editingFactValue}
                            min={config?.min}
                            max={config?.max}
                            onChange={e => { setEditingFactValue(e.target.value); setFactError(null) }}
                            className={`flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 ${factError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
                          />
                        )}
                        <button
                          onClick={() => saveFactEdit(f)}
                          disabled={savingFact}
                          className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded disabled:opacity-50 shrink-0"
                        >
                          {t('common.save', 'Save')}
                        </button>
                        <button
                          onClick={() => { setEditingFactId(null); setFactError(null) }}
                          className="text-xs text-gray-500 hover:text-gray-700 shrink-0"
                        >
                          {t('settings.cancel_btn')}
                        </button>
                      </div>
                      {factError && <p className="text-xs text-red-500">{factError}</p>}
                    </div>
                  ) : (
                    <p className="text-gray-900 font-medium text-sm mt-0.5">{f.field_value}</p>
                  )}
                </div>
              )
            })}
            {facts.length === 0 && <p className="text-gray-400 text-sm">{t('settings.facts_empty')}</p>}
          </div>
          <Button
            variant="danger"
            onClick={handleDeleteFacts}
            disabled={deletingFacts || facts.length === 0}
          >
            {deletingFacts ? t('settings.deleting_facts_btn') : t('settings.delete_facts_btn')}
          </Button>
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-900 mb-2">{t('settings.account_heading')}</h2>
          <p className="text-sm text-gray-600 mb-4">{t('settings.email_label')} <span className="font-medium text-gray-900">{user?.email}</span></p>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-medium text-red-700 mb-1">{t('settings.delete_account_heading')}</h3>
            <p className="text-sm text-gray-500 mb-3">{t('settings.delete_account_desc')}</p>
            <label className="text-sm font-medium text-gray-700 block mb-1">{t('settings.delete_type_label')}</label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 w-full focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== 'DELETE' || deletingAccount}
            >
              {deletingAccount ? t('settings.deleting_account_btn') : t('settings.delete_account_btn')}
            </Button>
          </div>
        </Card>
      </div>
    </Sidebar>
  )
}
