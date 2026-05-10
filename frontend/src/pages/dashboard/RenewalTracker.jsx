import { useState } from 'react'
import supabase from '../../lib/supabase'
import { useAuthContext } from '../../context/AuthContext'

function addMonths(dateStr, months) {
  const d = new Date(dateStr)
  d.setMonth(d.getMonth() + months)
  return d
}

function daysUntil(date) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.ceil((date - now) / (1000 * 60 * 60 * 24))
}

export default function RenewalTracker({ programs, onRefetch }) {
  const { user } = useAuthContext()
  const [renewing, setRenewing] = useState(null)

  const approved = programs.filter(
    p => p.status === 'approved' && p.approved_at && p.programs?.renewal_period_months
  )

  if (approved.length === 0) return null

  async function markRenewed(programId) {
    setRenewing(programId)
    const now = new Date().toISOString()
    await supabase
      .from('user_programs')
      .update({ last_renewed_at: now, approved_at: now })
      .eq('user_id', user.id)
      .eq('program_id', programId)
    setRenewing(null)
    onRefetch?.()
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4" style={{ color: '#1e0f3d' }}>Renewal Tracker</h2>
      <div className="flex flex-col gap-3">
        {approved.map(p => {
          const baseDate = p.last_renewed_at ?? p.approved_at
          const renewalDate = addMonths(baseDate, p.programs.renewal_period_months)
          const days = daysUntil(renewalDate)
          const overdue = days < 0
          const urgent = !overdue && days <= 30

          const borderColor = overdue ? '#fca5a5' : urgent ? '#fcd34d' : '#e5e7eb'
          const daysColor = overdue ? '#dc2626' : urgent ? '#d97706' : '#059669'
          const daysLabel = overdue
            ? `${Math.abs(days)}d overdue`
            : days === 0
            ? 'Due today'
            : `${days}d until renewal`

          return (
            <div
              key={p.id}
              className="bg-white rounded-xl p-4"
              style={{ border: `1.5px solid ${borderColor}` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm">{p.programs?.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#7c5bb5' }}>
                    Approved {new Date(p.approved_at).toLocaleDateString()}
                    {p.last_renewed_at && p.last_renewed_at !== p.approved_at && (
                      <> · Renewed {new Date(p.last_renewed_at).toLocaleDateString()}</>
                    )}
                  </div>
                  {p.programs?.renewal_notes && (
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {p.programs.renewal_notes}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                  <span className="text-sm font-bold" style={{ color: daysColor }}>
                    {daysLabel}
                  </span>
                  <span className="text-xs text-gray-400">
                    Due {renewalDate.toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => markRenewed(p.program_id)}
                    disabled={renewing === p.program_id}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={{ background: '#f3eeff', color: '#7c5bb5' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#7c5bb5'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f3eeff'; e.currentTarget.style.color = '#7c5bb5' }}
                  >
                    {renewing === p.program_id ? 'Saving…' : 'Mark renewed'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
