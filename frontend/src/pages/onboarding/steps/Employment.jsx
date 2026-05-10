import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../components/ui/Button'

export default function Employment({ value, onNext, onBack }) {
  const { t } = useTranslation()
  const [status, setStatus] = useState(value.employment_status ?? '')

  const OPTIONS = [
    { value: 'employed', label: t('onboarding.employed_full') },
    { value: 'part-time', label: t('onboarding.employed_part') },
    { value: 'unemployed', label: t('onboarding.unemployed') },
    { value: 'retired', label: t('onboarding.retired') },
    { value: 'student', label: t('onboarding.student') },
    { value: 'self-employed', label: t('onboarding.self_employed') },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.employment_title')}</h2>
      </div>
      <div className="flex flex-col gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setStatus(opt.value)}
            className={`text-left px-4 py-3 rounded-lg border-2 transition-colors ${status === opt.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>{t('common.back')}</Button>}
        <Button onClick={() => onNext({ employment_status: status })} disabled={!status}>{t('common.continue')}</Button>
      </div>
    </div>
  )
}
