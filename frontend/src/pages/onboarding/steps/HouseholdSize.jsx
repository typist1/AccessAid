import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function HouseholdSize({ value, onNext, onBack }) {
  const { t } = useTranslation()
  const [size, setSize] = useState(value.household_size ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.household_title')}</h2>
        <p className="text-gray-500 mt-1">{t('onboarding.household_subtitle')}</p>
      </div>
      <Input label={t('onboarding.household_label')} type="number" min="1" max="20" value={size} onChange={e => setSize(e.target.value)} placeholder="3" autoFocus />
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>{t('common.back')}</Button>}
        <Button onClick={() => onNext({ household_size: size })} disabled={!size || size < 1}>{t('common.continue')}</Button>
      </div>
    </div>
  )
}
