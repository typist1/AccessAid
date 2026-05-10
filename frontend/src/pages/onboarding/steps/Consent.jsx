import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../components/ui/Button'

export default function Consent({ value, onNext, onBack, saving }) {
  const { t } = useTranslation()
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.consent_title')}</h2>
        <p className="text-gray-500 mt-1">{t('onboarding.consent_subtitle')}</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
        <p>{t('onboarding.consent_intro')}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{t('onboarding.consent_item1')}</li>
          <li>{t('onboarding.consent_item2')}</li>
          <li>{t('onboarding.consent_item3')}</li>
          <li>{t('onboarding.consent_item4')}</li>
          <li>{t('onboarding.consent_item5')}</li>
          <li>{t('onboarding.consent_item6')}</li>
        </ul>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 text-blue-600 rounded border-gray-300"
        />
        <span className="text-sm text-gray-700">{t('onboarding.consent_agree')}</span>
      </label>

      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>{t('common.back')}</Button>}
        <Button onClick={() => onNext({ consent: true })} disabled={!agreed || saving}>
          {saving ? t('onboarding.saving_profile') : t('onboarding.find_programs_btn')}
        </Button>
      </div>
    </div>
  )
}
