import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../components/ui/Button'

export default function Disability({ value, onNext, onBack }) {
  const { t } = useTranslation()
  const [status, setStatus] = useState(value.disability_status ?? '')

  const OPTIONS = [
    { value: 'yes', label: t('onboarding.disability_yes') },
    { value: 'no', label: t('onboarding.disability_no') },
    { value: 'prefer_not_to_say', label: t('onboarding.disability_prefer') },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.disability_title')}</h2>
        <p className="text-gray-500 mt-1">{t('onboarding.disability_subtitle')}</p>
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
        <Button onClick={() => onNext({ disability_status: status })} disabled={!status}>{t('common.continue')}</Button>
      </div>
    </div>
  )
}
