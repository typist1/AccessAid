import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function Age({ value, onNext, onBack }) {
  const { t } = useTranslation()
  const [age, setAge] = useState(value.age ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.age_title')}</h2>
        <p className="text-gray-500 mt-1">{t('onboarding.age_subtitle')}</p>
      </div>
      <Input label={t('onboarding.age_label')} type="number" min="0" max="120" value={age} onChange={e => setAge(e.target.value)} placeholder="34" autoFocus />
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>{t('common.back')}</Button>}
        <Button onClick={() => onNext({ age })} disabled={!age}>{t('common.continue')}</Button>
      </div>
    </div>
  )
}
