import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from '../../lib/auth'
import { useState } from 'react'
import ChatWidget from '../chat/ChatWidget'

const NAV = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/documents', label: 'Documents' },
  { to: '/settings', label: 'Settings' },
]

export default function Sidebar({ children }) {
  const navigate = useNavigate()
  const [chatOpen, setChatOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#f9f5ff' }}>
      <aside
        className="w-56 flex flex-col py-6 px-4 shrink-0"
        style={{ background: 'linear-gradient(160deg, #2d1659 0%, #1a0936 100%)' }}
      >
        <div className="mb-8">
          <span className="text-base font-bold text-white tracking-tight">AccessAid</span>
          <div className="w-6 h-0.5 mt-1 rounded-full" style={{ background: '#d4a843' }} />
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-purple-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => setChatOpen(true)}
            className="text-left px-3 py-2 rounded-lg text-sm font-medium text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Ask Assistant
          </button>
          <button
            onClick={handleSignOut}
            className="text-left px-3 py-2 rounded-lg text-sm font-medium text-purple-500/50 hover:text-purple-300 hover:bg-white/10 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>

      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}
