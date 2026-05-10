import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import backgroundImg from '../assets/background.png'
import dancingImg from '../assets/dancing.png'
import dance2Img from '../assets/dance2.png'
import meditationImg from '../assets/meditation.png'

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f5f0ff 0%, #ede8ff 60%, #fff8e7 100%)' }}>
      {/* background image */}
      <img
        src={backgroundImg}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.18 }}
        alt=""
      />

      {/* decorative characters */}
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
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-purple-900">Sign in</Button>
            </Link>
            <Link to="/signup">
              <Button variant="purple">Get started</Button>
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 pt-20 pb-48 text-center">
          <h1 className="text-5xl font-bold leading-tight" style={{ color: '#1e0f3d' }}>
            $140 billion in benefits<br />
            go <span style={{ color: '#7c3aed' }}>unclaimed every year.</span>
          </h1>
          <p className="mt-6 text-xl max-w-xl mx-auto" style={{ color: '#4c3875' }}>
            AccessAid finds government assistance programs you qualify for — and walks you through applying. Free, private, no paperwork headaches.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Link to="/signup">
              <Button variant="purple" className="px-8 py-3 text-lg">
                Find my programs →
              </Button>
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { icon: '🔍', title: 'Find what you qualify for', desc: 'Answer a few questions and we match you with SNAP, Medicaid, housing, utility help, and more.' },
              { icon: '📄', title: 'Upload documents once', desc: 'Scan or upload your ID, pay stubs, or tax forms. We extract the info and auto-fill future applications.' },
              { icon: '💬', title: 'AI assistant that explains everything', desc: 'Ask anything about a program. Get plain-English answers, not government jargon.' },
            ].map(card => (
              <div
                key={card.title}
                className="rounded-2xl p-6 shadow-sm"
                style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(124,58,237,0.12)' }}
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: '#1e0f3d' }}>{card.title}</h3>
                <p className="text-sm" style={{ color: '#7c5bb5' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </main>

        <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'rgba(124,58,237,0.1)', color: '#9b6ff0' }}>
          AccessAid — Informational guidance only, not legal or financial advice.{' '}
          <Link to="/signup" style={{ color: '#7c3aed' }} className="hover:underline">Get started</Link>
        </footer>
      </div>
    </div>
  )
}
