import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'

export default function LanguagePicker({ className = '' }) {
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()

  return (
    <div className={`relative inline-flex ${className}`}>
      <select
        value={language}
        onChange={e => setLanguage(e.target.value)}
        className="min-w-[7.75rem] appearance-none rounded-lg border border-violet-200 bg-white px-3.5 py-2 pr-9 text-sm font-medium text-[#2d1659] outline-none transition-colors focus:border-violet-300 focus:ring-2 focus:ring-violet-200/70 cursor-pointer"
        aria-label={t('language_picker.label')}
      >
        <option value="en">{t('language_picker.en')}</option>
        <option value="es">{t('language_picker.es')}</option>
      </select>

      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#5c4b86]">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  )
}
