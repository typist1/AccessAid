import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function FullName({ value, onNext, onBack }) {
  const { t } = useTranslation()
  const [name, setName] = useState(value.full_name ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.full_name_title')}</h2>
        <p className="text-gray-500 mt-1">{t('onboarding.full_name_subtitle')}</p>
      </div>
      <Input label={t('onboarding.full_name_label')} value={name} onChange={e => setName(e.target.value)} placeholder="Maria Hernandez" autoFocus />
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>{t('common.back')}</Button>}
        <Button onClick={() => onNext({ full_name: name })} disabled={!name.trim()}>{t('common.continue')}</Button>
      </div>
    </div>
  )
}
