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
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col py-6 px-4 shrink-0">
        <div className="mb-8">
          <span className="text-base font-semibold text-gray-900 tracking-tight">AccessAid</span>
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm font-medium transition-colors ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => setChatOpen(true)}
            className="text-left px-3 py-2 rounded text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Ask Assistant
          </button>
          <button
            onClick={handleSignOut}
            className="text-left px-3 py-2 rounded text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
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
