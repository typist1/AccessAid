import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../components/ui/Button'
import LanguagePicker from '../components/ui/LanguagePicker'
import backgroundImg from '../assets/background.png'
import dancingImg from '../assets/dancing.png'
import dance2Img from '../assets/dance2.png'
import meditationImg from '../assets/meditation.png'

function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
      <div className="relative min-h-[35rem] sm:min-h-[44rem] lg:min-h-[52rem]">
        <div
          className="absolute left-1 top-6 h-[31rem] w-[92%] overflow-hidden rounded-[2rem] sm:left-3 sm:top-8 sm:h-[35rem] sm:w-[90%] lg:left-2 lg:top-8 lg:h-[39rem] lg:w-[90%]"
          style={{
            background: 'rgba(255,255,255,0.98)',
            border: '1px solid rgba(124,58,237,0.12)',
            boxShadow: '0 22px 60px rgba(45,22,89,0.14)',
          }}
        >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(124,58,237,0.12)' }}>
              <div>
                <div className="text-2xl font-bold tracking-tight" style={{ color: '#1e0f3d' }}>Hi, Albert ✨</div>
                <div className="mt-1 text-sm font-medium" style={{ color: '#6b5a92' }}>
                  <span style={{ color: '#059669' }}>9 strong</span>,{' '}
                  <span style={{ color: '#d97706' }}>2 possible</span>{' '}
                  matches found
                </div>
              </div>
              <div className="flex gap-3">
                <div className="rounded-2xl px-4 py-3 text-sm font-semibold whitespace-nowrap" style={{ background: 'rgba(124,58,237,0.08)', color: '#2d1659', border: '1px solid rgba(45,22,89,0.14)' }}>
                  Search programs
                </div>
                <div className="rounded-2xl px-4 py-3 text-sm font-semibold whitespace-nowrap" style={{ background: 'rgba(124,58,237,0.08)', color: '#2d1659', border: '1px solid rgba(45,22,89,0.14)' }}>
                  Ask Assistant
                </div>
              </div>
            </div>

            <div className="px-5 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mt-1 text-3xl font-bold tracking-tight" style={{ color: '#24124b' }}>Start with these</h3>
                  <p className="mt-2 text-sm" style={{ color: '#7c5bb5' }}>
                    Best-fit programs based on your profile.
                  </p>
                </div>
                <div className="rounded-2xl px-4 py-3 text-lg font-semibold" style={{ background: 'rgba(168,85,247,0.12)', color: '#7c3aed' }}>
                  9 programs
                </div>
              </div>

              {[
                {
                  category: 'Food',
                  categoryBg: 'rgba(255, 84, 112, 0.08)',
                  categoryText: '#9f1239',
                  categoryBar: '#f43f5e',
                  title: 'SNAP',
                  description: 'Monthly food benefits for groceries.',
                },
                {
                  category: 'Health',
                  categoryBg: 'rgba(56, 189, 248, 0.08)',
                  categoryText: '#075985',
                  categoryBar: '#0ea5e9',
                  title: 'Medicaid',
                  description: 'Low-cost health coverage.',
                },
              ].map((program, index) => (
                <div
                  key={program.title}
                  className={`overflow-hidden rounded-[1.75rem] ${index === 1 ? 'hidden sm:block' : ''}`}
                  style={{
                    background: 'white',
                    border: '1px solid rgba(124,58,237,0.10)',
                    boxShadow: '0 14px 36px rgba(45,22,89,0.09)',
                  }}
                >
                  <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-lime-400 to-teal-300" />
                  <div className="grid gap-4 px-5 py-5 md:grid-cols-[1.35fr_0.8fr]">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: program.categoryText }}>
                          {program.category}
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: '#059669' }}>
                          Best bet
                        </div>
                      </div>
                      <div className="mt-4 text-[2rem] font-bold leading-tight tracking-tight" style={{ color: '#18213d' }}>
                        {program.title}
                      </div>
                      <div className="mt-2 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: '#4f5d78' }}>
                        Ready to start
                      </div>
                      <p className="mt-3 max-w-xl text-sm leading-6 whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: '#55657f' }}>
                        {program.description}
                      </p>
                    </div>

                    <div className="flex flex-col justify-between gap-5">
                      <div className="rounded-[1.5rem] p-5" style={{ background: 'rgba(15, 23, 42, 0.035)' }}>
                        <div className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: '#18213d' }}>
                          Before you start
                        </div>
                        <p className="mt-2 text-sm leading-6 whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: '#516079' }}>
                          Looks ready to review.
                        </p>
                      </div>
                      <div className="border-t pt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end" style={{ borderColor: 'rgba(124,58,237,0.08)' }}>
                        <div className="flex gap-3">
                          <div className="inline-flex min-w-[9rem] items-center justify-center whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: '#18213d', color: 'white' }}>
                            View details
                          </div>
                          <div className="inline-flex min-w-[10rem] items-center justify-center whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: 'white', color: '#42506a', border: '1px solid rgba(24,33,61,0.18)' }}>
                            Apply
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>

        <div
          className="absolute right-2 top-0 z-20 w-[56%] overflow-hidden rounded-[1.75rem] sm:right-3 sm:top-0 sm:w-[49%] lg:right-0 lg:top-0 lg:w-[44%]"
          style={{
            background: 'rgba(255,255,255,0.97)',
            border: '1px solid rgba(124,58,237,0.14)',
            boxShadow: '0 20px 50px rgba(45,22,89,0.18)',
          }}
        >
            <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'rgba(124,58,237,0.12)' }}>
              <div className="font-bold text-lg" style={{ color: '#1e0f3d' }}>Benefits Assistant</div>
              <div className="text-xl" style={{ color: '#9ca3af' }}>×</div>
            </div>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'rgba(124,58,237,0.12)' }}>
              <div>
                <div className="font-semibold text-base" style={{ color: '#1f2937' }}>Benefits Assistant</div>
                <div className="mt-0.5 text-xs" style={{ color: '#6b7280' }}>Ask anything — type or speak</div>
              </div>
              <span className="text-sm font-medium" style={{ color: '#6b7280' }}>Voice off</span>
            </div>
            <div className="p-4">
              <div className="rounded-[1.5rem] p-4 text-[0.95rem] leading-7" style={{ background: 'rgba(15,23,42,0.05)', color: '#405066' }}>
                Ask about programs you may qualify for. I can explain eligibility, documents, and next steps.
                <div className="mt-3 italic">
                  Informational only.
                </div>
              </div>
            </div>
            <div className="border-t p-3 flex gap-2" style={{ borderColor: 'rgba(124,58,237,0.12)' }}>
              <div className="flex-1 rounded-2xl py-3" style={{ border: '1px solid rgba(124,58,237,0.18)' }}>
              </div>
              <div className="w-10 rounded-2xl py-3 text-center text-lg" style={{ border: '1px solid rgba(124,58,237,0.18)', color: '#6b7280' }}>◖</div>
              <div className="rounded-2xl px-5 py-3 text-base font-semibold" style={{ background: '#8ea6f4', color: 'white' }}>Send</div>
            </div>
        </div>

        <div
          className="absolute left-0 top-[21rem] z-30 w-[72%] overflow-hidden rounded-[1.75rem] sm:left-0 sm:top-[25rem] sm:w-[58%] lg:left-0 lg:top-[29rem] lg:w-[48%]"
          style={{
            background: 'rgba(255,255,255,0.97)',
            border: '1px solid rgba(124,58,237,0.14)',
            boxShadow: '0 18px 48px rgba(45,22,89,0.16)',
          }}
        >
            <div className="flex items-center justify-between px-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: '#eef2ff', color: '#2563eb' }}>✦</div>
                <div className="text-lg font-bold" style={{ color: '#1f2937' }}>AccessAid</div>
              </div>
              <div className="text-xl" style={{ color: '#9ca3af' }}>×</div>
            </div>
            <div className="px-4 py-4">
              <div className="text-[1.5rem] leading-tight tracking-tight" style={{ color: '#3c495f' }}>
                Autofill 219 fields from your profile?
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl px-4 py-3 text-center text-base font-semibold" style={{ background: '#3464e8', color: 'white' }}>
                  Autofill
                </div>
                <div className="rounded-2xl px-4 py-3 text-center text-base font-semibold" style={{ background: '#f1f5f9', color: '#475569' }}>
                  Not now
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

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

        <main className="max-w-7xl mx-auto px-6 pt-10 pb-40">
          <section className="grid items-center gap-16 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="max-w-xl">
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl" style={{ color: '#1e0f3d' }}>
                {t('landing.headline')}
              </h1>
              <p className="mt-6 text-xl leading-9" style={{ color: '#4c3875' }}>
                {t('landing.subhead')}
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link to="/signup">
                  <Button variant="purple" className="px-8 py-3.5 text-lg">
                    {t('landing.cta')}
                  </Button>
                </Link>
                <a
                  href="#showcase"
                  className="inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-lg font-medium transition-colors"
                  style={{ background: 'rgba(255,255,255,0.75)', color: '#2d1659', border: '1px solid rgba(45,22,89,0.10)' }}
                >
                  {t('landing.secondary_cta')}
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  { value: '3', label: t('landing.stat_1') },
                  { value: '219', label: t('landing.stat_2') },
                  { value: '<2 min', label: t('landing.stat_3') },
                ].map(stat => (
                  <div
                    key={stat.label}
                    className="rounded-2xl p-4"
                    style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(124,58,237,0.10)' }}
                  >
                    <div className="text-2xl font-bold tracking-tight" style={{ color: '#1e0f3d' }}>{stat.value}</div>
                    <div className="mt-1 text-sm leading-6" style={{ color: '#7c5bb5' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div id="showcase" className="relative">
              <HeroShowcase />
            </div>
          </section>

          <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
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
          </section>
        </main>

        <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'rgba(124,58,237,0.1)', color: '#9b6ff0' }}>
          {t('landing.footer')}{' '}
          <Link to="/signup" style={{ color: '#7c3aed' }} className="hover:underline">{t('landing.footer_cta')}</Link>
        </footer>
      </div>
    </div>
  )
}
