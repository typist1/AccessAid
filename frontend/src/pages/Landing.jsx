import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">AccessAid</span>
        <div className="flex gap-3">
          <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
          <Link to="/signup"><Button>Get started</Button></Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          $140 billion in benefits go<br />
          <span className="text-blue-600">unclaimed every year.</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          AccessAid helps you find government assistance programs you're eligible for — and walks you through applying. Free, private, no paperwork headaches.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <Link to="/signup"><Button className="px-8 py-3 text-lg">Find my programs</Button></Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { icon: '🔍', title: 'Find what you qualify for', desc: 'Answer a few questions and we match you with SNAP, Medicaid, housing, utility help, and more.' },
            { icon: '📄', title: 'Upload documents once', desc: 'Scan or upload your ID, pay stubs, or tax forms. We extract the info and auto-fill future applications.' },
            { icon: '💬', title: 'AI assistant that explains everything', desc: 'Ask anything about a program. Get plain-English answers, not government jargon.' },
          ].map(card => (
            <div key={card.title} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        AccessAid — Informational guidance only, not legal or financial advice. <Link to="/signup" className="text-blue-600 hover:underline">Get started</Link>
      </footer>
    </div>
  )
}
