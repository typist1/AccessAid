import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../components/ui/Button'

export default function Income({ value, onNext, onBack }) {
  const { t } = useTranslation()
  const [income, setIncome] = useState(value.income ?? '')

  const OPTIONS = [
    { value: '<15k', label: t('onboarding.income_under15k') },
    { value: '15-30k', label: t('onboarding.income_15_30k') },
    { value: '30-50k', label: t('onboarding.income_30_50k') },
    { value: '50k+', label: t('onboarding.income_50kplus') },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.income_title')}</h2>
        <p className="text-gray-500 mt-1">{t('onboarding.income_subtitle')}</p>
      </div>
      <div className="flex flex-col gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setIncome(opt.value)}
            className={`text-left px-4 py-3 rounded-lg border-2 transition-colors ${income === opt.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>{t('common.back')}</Button>}
        <Button onClick={() => onNext({ income })} disabled={!income}>{t('common.continue')}</Button>
      </div>
    </div>
  )
}
