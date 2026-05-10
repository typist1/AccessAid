import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from '../../lib/auth'
import { useState } from 'react'
import ChatWidget from '../chat/ChatWidget'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/documents', label: 'Documents', icon: '📄' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar({ children }) {
  const navigate = useNavigate()
  const [chatOpen, setChatOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col py-6 px-4 shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold text-blue-600">AccessAid</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span>💬</span>
            Ask Assistant
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <span>→</span>
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
