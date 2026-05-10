import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../components/ui/Button'
import LanguagePicker from '../components/ui/LanguagePicker'
import backgroundImg from '../assets/background.png'
import dancingImg from '../assets/dancing.png'
import dance2Img from '../assets/dance2.png'
import meditationImg from '../assets/meditation.png'

export default function Landing() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f5f0ff 0%, #ede8ff 60%, #fff8e7 100%)' }}>
      <img
        src={backgroundImg}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.18 }}
        alt=""
      />
      <img
        src={dance2Img}
        className="absolute bottom-0 right-0 w-72 pointer-events-none select-none"
        style={{ opacity: 0.9, filter: 'drop-shadow(0 8px 24px rgba(45,22,89,0.2))' }}
        alt=""
      />
      <img
        src={dancingImg}
        className="absolute bottom-0 left-4 w-52 pointer-events-none select-none"
        style={{ opacity: 0.85, filter: 'drop-shadow(0 8px 24px rgba(45,22,89,0.15))' }}
        alt=""
      />
      <img
        src={meditationImg}
        className="absolute top-24 right-8 w-36 pointer-events-none select-none"
        style={{ opacity: 0.65, filter: 'drop-shadow(0 4px 12px rgba(45,22,89,0.1))' }}
        alt=""
      />

      <div className="relative z-10">
        <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold" style={{ color: '#2d1659' }}>AccessAid</span>
            <div className="w-8 h-0.5 mt-0.5 rounded-full" style={{ background: '#d4a843' }} />
          </div>
          <div className="flex gap-3 items-center">
            <LanguagePicker />
            <Link to="/login">
              <Button variant="ghost" className="text-purple-900">{t('landing.sign_in')}</Button>
            </Link>
            <Link to="/signup">
              <Button variant="purple">{t('landing.get_started')}</Button>
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 pt-20 pb-48 text-center">
          <h1 className="text-5xl font-bold leading-tight" style={{ color: '#1e0f3d' }}>
            {t('landing.headline')}
          </h1>
          <p className="mt-6 text-xl max-w-xl mx-auto" style={{ color: '#4c3875' }}>
            {t('landing.subhead')}
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Link to="/signup">
              <Button variant="purple" className="px-8 py-3 text-lg">
                {t('landing.cta')}
              </Button>
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { icon: '🔍', titleKey: 'landing.card1_title', descKey: 'landing.card1_desc' },
              { icon: '📄', titleKey: 'landing.card2_title', descKey: 'landing.card2_desc' },
              { icon: '💬', titleKey: 'landing.card3_title', descKey: 'landing.card3_desc' },
            ].map(card => (
              <div
                key={card.titleKey}
                className="rounded-2xl p-6 shadow-sm"
                style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(124,58,237,0.12)' }}
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: '#1e0f3d' }}>{t(card.titleKey)}</h3>
                <p className="text-sm" style={{ color: '#7c5bb5' }}>{t(card.descKey)}</p>
              </div>
            ))}
          </div>
        </main>

        <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'rgba(124,58,237,0.1)', color: '#9b6ff0' }}>
          {t('landing.footer')}{' '}
          <Link to="/signup" style={{ color: '#7c3aed' }} className="hover:underline">{t('landing.footer_cta')}</Link>
        </footer>
      </div>
    </div>
  )
}
