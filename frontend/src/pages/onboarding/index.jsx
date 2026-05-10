import { useState, useRef, useEffect } from 'react'
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

const STEPS = [FullName, Age, State, Employment, Income, HouseholdSize, Citizenship, Children, Disability, Student, Consent]

const frameUrls = Object.entries(
  import.meta.glob('../../assets/higherRes/ezgif-frame-*.jpg', { eager: true, import: 'default' })
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url)

export default function Onboarding() {
  const { user } = useAuthContext()
  const { fetchProfile } = useUserContext()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [saving, setSaving] = useState(false)
  const [displayFrame, setDisplayFrame] = useState(0)
  const frameRef = useRef(0)
  const rafRef = useRef(null)

  const Step = STEPS[step]
  const total = STEPS.length

  useEffect(() => {
    const target = Math.floor(step * frameUrls.length / total)
    let tick = 0
    const animate = () => {
      tick++
      if (tick % 2 === 0) {
        const cur = frameRef.current
        if (cur !== target) {
          const next = cur < target ? cur + 1 : cur - 1
          frameRef.current = next
          setDisplayFrame(next)
        }
      }
      if (frameRef.current !== target) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [step, total])

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

    // Write each field to user_facts
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
      {frameUrls.length > 0 && (
        <img
          src={frameUrls[displayFrame]}
          className="fixed inset-0 w-full h-full object-cover -z-10"
          alt=""
        />
      )}
      <div className="fixed inset-0 bg-black/50 -z-10" />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-lg">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Step {step + 1} of {total}</p>
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
