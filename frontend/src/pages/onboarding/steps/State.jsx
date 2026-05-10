import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'

const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']

export default function State({ value, onNext, onBack }) {
  const { t } = useTranslation()
  const [state, setState] = useState(value.state ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.state_title')}</h2>
        <p className="text-gray-500 mt-1">{t('onboarding.state_subtitle')}</p>
      </div>
      <Select
        label={t('onboarding.state_label')}
        value={state}
        onChange={e => setState(e.target.value)}
        options={[{ value: '', label: t('onboarding.state_placeholder') }, ...STATES.map(s => ({ value: s, label: s }))]}
      />
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>{t('common.back')}</Button>}
        <Button onClick={() => onNext({ state })} disabled={!state}>{t('common.continue')}</Button>
      </div>
    </div>
  )
}
