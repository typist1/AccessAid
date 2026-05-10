import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function Phone({ value, onNext, onBack }) {
  const { t } = useTranslation()
  const [phone, setPhone] = useState(value.phone ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.phone_title')}</h2>
        <p className="text-gray-500 mt-1">{t('onboarding.phone_subtitle')}</p>
      </div>
      <Input
        label={t('onboarding.phone_label')}
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="(312) 555-0100"
        type="tel"
        autoFocus
      />
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>{t('common.back')}</Button>}
        <Button variant="ghost" onClick={() => onNext({})}>{t('common.skip')}</Button>
        <Button onClick={() => onNext({ phone: phone.trim() })} disabled={!phone.trim()}>{t('common.continue')}</Button>
      </div>
    </div>
  )
}
