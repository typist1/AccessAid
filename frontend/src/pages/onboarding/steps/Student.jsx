import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../components/ui/Button'

export default function Student({ value, onNext, onBack }) {
  const { t } = useTranslation()
  const [status, setStatus] = useState(value.student_status ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.student_title')}</h2>
        <p className="text-gray-500 mt-1">{t('onboarding.student_subtitle')}</p>
      </div>
      <div className="flex gap-3">
        {['yes', 'no'].map(opt => (
          <button
            key={opt}
            onClick={() => setStatus(opt)}
            className={`flex-1 py-3 rounded-lg border-2 capitalize font-medium transition-colors ${status === opt ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
          >
            {opt === 'yes' ? t('common.yes') : t('common.no')}
          </button>
        ))}
      </div>
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>{t('common.back')}</Button>}
        <Button onClick={() => onNext({ student_status: status })} disabled={!status}>{t('common.continue')}</Button>
      </div>
    </div>
  )
}
