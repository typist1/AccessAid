import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'

export default function LanguagePicker({ className = '' }) {
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()

  return (
    <select
      value={language}
      onChange={e => setLanguage(e.target.value)}
      className={`text-sm border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer ${className}`}
      aria-label={t('language_picker.label')}
    >
      <option value="en">{t('language_picker.en')}</option>
      <option value="es">{t('language_picker.es')}</option>
    </select>
  )
}
