import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../../context/LanguageContext'
import Button from '../../../components/ui/Button'

export default function Language({ value, onNext, onBack }) {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()

  function handleSelect(lang) {
    setLanguage(lang)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('onboarding.language_title')}</h2>
        <p className="text-gray-500 mt-1">{t('onboarding.language_subtitle')}</p>
      </div>
      <div className="flex flex-col gap-2">
        {['en', 'es'].map(lang => (
          <button
            key={lang}
            onClick={() => handleSelect(lang)}
            className={`text-left px-4 py-3 rounded-lg border-2 transition-colors ${language === lang ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
          >
            {lang === 'en' ? 'English' : 'Español'}
          </button>
        ))}
      </div>
      <div className="flex gap-3 justify-end">
        {onBack && <Button variant="ghost" onClick={onBack}>{t('common.back')}</Button>}
        <Button onClick={() => onNext({ language_preference: language })}>
          {t('common.continue')}
        </Button>
      </div>
    </div>
  )
}
