import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../components/ui/Button'

export default function Citizenship({ value, onNext, onBack }) {
  const { t } = useTranslation()
  const [status, setStatus] = useState(value.citizenship_status ?? '')

  const OPTIONS = [
    { value: 'citizen', label: t('onboarding.citizen') },
    { value: 'permanent_resident', label: t('onboarding.permanent_resident') },
    { value: 'visa', label: t('onboarding.visa') },
    { value: 'undocumented', label: t('onboarding.undocumented') },
    { value: 'prefer_not_to_say', label: t('onboarding.prefer_not_to_say') },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.citizenship_title')}</h2>
        <p className="text-gray-500 mt-1">{t('onboarding.citizenship_subtitle')}</p>
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
        <Button onClick={() => onNext({ citizenship_status: status })} disabled={!status}>{t('common.continue')}</Button>
      </div>
    </div>
  )
}
