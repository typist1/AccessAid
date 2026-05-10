import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../lib/supabase'
import { useAuthContext } from '../../context/AuthContext'
import { useUserContext } from '../../context/UserContext'
import ProgressBar from '../../components/ui/ProgressBar'
import Language from './steps/Language'
import FullName from './steps/FullName'
import DateOfBirth from './steps/DateOfBirth'
import Address from './steps/Address'
import State from './steps/State'
import MaritalStatus from './steps/MaritalStatus'
import SSN from './steps/SSN'
import Employment from './steps/Employment'
import EmployerInfo from './steps/EmployerInfo'
import Income from './steps/Income'
import HouseholdSize from './steps/HouseholdSize'
import Citizenship from './steps/Citizenship'
import Children from './steps/Children'
import Pregnant from './steps/Pregnant'
import Disability from './steps/Disability'
import Student from './steps/Student'
import ShelterCosts from './steps/ShelterCosts'
import Phone from './steps/Phone'
import Consent from './steps/Consent'
import animationVideo from '../../assets/animationInspo.mp4'

const STEPS = [
  Language,
  FullName,
  DateOfBirth,
  Address,
  State,
  MaritalStatus,
  SSN,
  Employment,
  EmployerInfo,
  Income,
  HouseholdSize,
  Citizenship,
  Children,
  Pregnant,
  Disability,
  Student,
  ShelterCosts,
  Phone,
  Consent,
]

export default function Onboarding() {
  const { user } = useAuthContext()
  const { fetchProfile, facts } = useUserContext()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  // Pre-populate answers from any existing facts (e.g. from document upload)
  const [answers, setAnswers] = useState(() => {
    const seed = {}
    for (const f of facts) {
      seed[f.field_key] = f.field_value
    }
    return seed
  })

  const Step = STEPS[step]
  const total = STEPS.length

  function handleNext(data) {
    const updated = { ...answers, ...data }
    setAnswers(updated)
    if (step < total - 1) {
      setStep(s => s + 1)
    } else {
      handleComplete(updated)
    }
  }

  async function handleComplete(data) {
    setSaving(true)

    const firstName = data.first_name ?? ''
    const lastName = data.last_name ?? ''
    const fullName = [firstName, lastName].filter(Boolean).join(' ')

    const profileData = {
      user_id: user.id,
      full_name: fullName,
      age: data.age ? parseInt(data.age) : null,
      state: data.state ?? null,
      employment_status: data.employment_status ?? null,
      income: data.income ?? null,
      household_size: data.household_size ? parseInt(data.household_size) : null,
      citizenship_status: data.citizenship_status ?? null,
      has_children: data.has_children === 'yes',
      children_count: parseInt(data.children_count || 0),
      disability_status: data.disability_status ?? null,
      student_status: data.student_status ?? null,
      language_preference: data.language_preference ?? 'en',
    }

    const { error: profileError } = await supabase
      .from('user_profile')
      .upsert(profileData, { onConflict: 'user_id' })

    if (profileError) {
      console.error('Profile upsert failed:', profileError)
      setSaving(false)
      return
    }

    // Write every collected field to user_facts for autofill
    const factEntries = [
      ['first_name', firstName],
      ['last_name', lastName],
      ['full_name', fullName],
      ['date_of_birth', data.date_of_birth],
      ['age', data.age],
      ['address', data.address],
      ['apartment_number', data.apartment_number],
      ['city', data.city],
      ['zip_code', data.zip_code],
      ['county', data.county],
      ['state', data.state],
      ['marital_status', data.marital_status],
      ['ssn_last4', data.ssn_last4],
      ['employment_status', data.employment_status],
      ['employer_name', data.employer_name],
      ['employer_address', data.employer_address],
      ['employer_phone', data.employer_phone],
      ['hours_per_week', data.hours_per_week],
      ['pay_frequency', data.pay_frequency],
      ['monthly_income_current', data.monthly_income_current],
      ['income', data.income],
      ['household_size', data.household_size],
      ['citizenship_status', data.citizenship_status],
      ['has_children', data.has_children],
      ['children_count', data.children_count],
      ['pregnant', data.pregnant],
      ['due_date', data.due_date],
      ['babies_expected', data.babies_expected],
      ['disability_status', data.disability_status],
      ['student_status', data.student_status],
      ['monthly_rent', data.monthly_rent],
      ['heating_included', data.heating_included],
      ['phone_cell', data.phone],
      ['language_preference', data.language_preference],
    ]
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([field_key, field_value]) => ({
        user_id: user.id,
        field_key,
        field_value: String(field_value),
        source: 'onboarding',
      }))

    await supabase.from('user_facts').upsert(factEntries, { onConflict: 'user_id,field_key' })

    await fetchProfile()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        <source src={animationVideo} type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-purple-950/60 -z-10" />

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-8 w-full max-w-lg">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-purple-700 tracking-tight">AccessAid</span>
            <p className="text-xs text-purple-400">Step {step + 1} of {total}</p>
          </div>
          <ProgressBar value={step + 1} max={total} />
        </div>

        <Step
          value={answers}
          onNext={handleNext}
          onBack={step > 0 ? () => setStep(s => s - 1) : null}
          saving={saving}
        />
      </div>
    </div>
  )
}
