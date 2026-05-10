import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../lib/supabase'
import { useAuthContext } from '../../context/AuthContext'
import { useUserContext } from '../../context/UserContext'
import ProgressBar from '../../components/ui/ProgressBar'
import FullName from './steps/FullName'
import Age from './steps/Age'
import State from './steps/State'
import Employment from './steps/Employment'
import Income from './steps/Income'
import HouseholdSize from './steps/HouseholdSize'
import Citizenship from './steps/Citizenship'
import Children from './steps/Children'
import Disability from './steps/Disability'
import Student from './steps/Student'
import Consent from './steps/Consent'
import animationVideo from '../../assets/animationInspo.mp4'

const STEPS = [FullName, Age, State, Employment, Income, HouseholdSize, Citizenship, Children, Disability, Student, Consent]

export default function Onboarding() {
  const { user } = useAuthContext()
  const { fetchProfile } = useUserContext()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [saving, setSaving] = useState(false)

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
    const profileData = {
      user_id: user.id,
      full_name: data.full_name,
      age: parseInt(data.age),
      state: data.state,
      employment_status: data.employment_status,
      income: data.income,
      household_size: parseInt(data.household_size),
      citizenship_status: data.citizenship_status,
      has_children: data.has_children === 'yes',
      children_count: parseInt(data.children_count || 0),
      disability_status: data.disability_status,
      student_status: data.student_status,
    }

    await supabase.from('user_profile').upsert(profileData, { onConflict: 'user_id' })

    const facts = Object.entries(profileData)
      .filter(([k]) => k !== 'user_id')
      .map(([key, value]) => ({
        user_id: user.id,
        field_key: key,
        field_value: String(value),
        source: 'onboarding',
      }))

    await supabase.from('user_facts').upsert(facts, { onConflict: 'user_id,field_key' })

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
