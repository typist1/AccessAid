import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function Children({ value, onNext, onBack }) {
  const { t } = useTranslation()
  const [hasChildren, setHasChildren] = useState(value.has_children ?? '')
  const [count, setCount] = useState(value.children_count ?? '')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.children_title')}</h2>
      </div>
      <div className="flex gap-3">
        {['yes', 'no'].map(opt => (
          <button
            key={opt}
            onClick={() => setHasChildren(opt)}
            className={`flex-1 py-3 rounded-lg border-2 capitalize font-medium transition-colors ${hasChildren === opt ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
          >
            {opt === 'yes' ? t('common.yes') : t('common.no')}
          </button>
        ))}
      </div>
      {hasChildren === 'yes' && (
        <Input label={t('onboarding.children_count_label')} type="number" min="1" max="20" value={count} onChange={e => setCount(e.target.value)} placeholder="2" autoFocus />
      )}
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>{t('common.back')}</Button>}
        <Button
          onClick={() => onNext({ has_children: hasChildren, children_count: hasChildren === 'yes' ? count : '0' })}
          disabled={!hasChildren || (hasChildren === 'yes' && !count)}
        >{t('common.continue')}</Button>
      </div>
    </div>
  )
}
