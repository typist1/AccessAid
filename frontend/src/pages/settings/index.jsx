import { useState } from 'react'
import supabase from '../../lib/supabase'
import { useAuthContext } from '../../context/AuthContext'
import { useUserContext } from '../../context/UserContext'
import { signOut } from '../../lib/auth'
import { useToast } from '../../components/ui/Toast'
import Sidebar from '../../components/layout/Sidebar'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

const EDITABLE_FIELDS = [
  { key: 'full_name', label: 'Full Name', type: 'text' },
  { key: 'state', label: 'State', type: 'text' },
  { key: 'employment_status', label: 'Employment Status', type: 'text' },
  { key: 'income', label: 'Income Range', type: 'text' },
  { key: 'household_size', label: 'Household Size', type: 'number' },
]

export default function Settings() {
  const { user } = useAuthContext()
  const { profile, facts, fetchFacts, fetchProfile } = useUserContext()
  const { toast } = useToast()

  // Profile edit state
  const [editing, setEditing] = useState(false)
  const [editValues, setEditValues] = useState({})
  const [savingProfile, setSavingProfile] = useState(false)

  // Delete facts state
  const [deletingFacts, setDeletingFacts] = useState(false)

  // Delete account state
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deletingAccount, setDeletingAccount] = useState(false)

  function startEdit() {
    const vals = {}
    EDITABLE_FIELDS.forEach(({ key }) => {
      vals[key] = profile?.[key] ?? ''
    })
    setEditValues(vals)
    setEditing(true)
  }

  async function saveProfile() {
    setSavingProfile(true)
    try {
      const updates = { ...editValues }
      if (updates.household_size) updates.household_size = parseInt(updates.household_size)

      await supabase.from('user_profile').update(updates).eq('user_id', user.id)

      // Mirror to user_facts
      const factUpdates = Object.entries(updates).map(([key, value]) => ({
        user_id: user.id,
        field_key: key,
        field_value: String(value),
        source: 'settings',
      }))
      await supabase.from('user_facts').upsert(factUpdates, { onConflict: 'user_id,field_key' })

      await fetchProfile()
      setEditing(false)
      toast('Profile updated. Eligibility matches will refresh shortly.', 'success')

      // Trigger eligibility re-score in background
      const { data: { session } } = await supabase.auth.getSession()
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/eligibility/score`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).catch(console.error)
    } catch (e) {
      toast(`Failed to save: ${e.message}`, 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleDeleteFacts() {
    if (!window.confirm('Delete all stored facts? This will clear auto-fill data from your profile.')) return
    setDeletingFacts(true)
    await supabase.from('user_facts').delete().eq('user_id', user.id)
    await fetchFacts()
    setDeletingFacts(false)
    toast('All stored facts deleted.', 'success')
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE') return
    setDeletingAccount(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      await signOut()
    } catch (e) {
      toast(`Failed to delete account: ${e.message}`, 'error')
      setDeletingAccount(false)
    }
  }

  return (
    <Sidebar>
      <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

        {/* Profile */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Your Profile</h2>
            {!editing && profile && (
              <Button variant="secondary" onClick={startEdit}>Edit</Button>
            )}
          </div>

          {editing ? (
            <div className="flex flex-col gap-3">
              {EDITABLE_FIELDS.map(({ key, label, type }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">{label}</label>
                  <input
                    type={type}
                    value={editValues[key] ?? ''}
                    onChange={e => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="flex gap-3 mt-2">
                <Button onClick={saveProfile} disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : profile ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(profile)
                .filter(([k]) => !['user_id', 'created_at', 'updated_at'].includes(k))
                .map(([k, v]) => (
                  <div key={k}>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">{k.replace(/_/g, ' ')}</p>
                    <p className="text-gray-900">{String(v)}</p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Profile not found.</p>
          )}
        </Card>

        {/* Stored Facts */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-1">Stored Facts ({facts.length})</h2>
          <p className="text-sm text-gray-600 mb-4">Used to auto-fill your applications. Built from onboarding, uploaded documents, and forms you've filled out.</p>
          <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto mb-4">
            {facts.map(f => (
              <div key={f.id} className="flex justify-between text-sm border-b border-gray-100 pb-1">
                <span className="text-gray-500">{f.field_key.replace(/_/g, ' ')}</span>
                <span className="text-gray-900 font-medium">{f.field_value}</span>
              </div>
            ))}
            {facts.length === 0 && <p className="text-gray-400 text-sm">No facts stored yet.</p>}
          </div>
          <Button
            variant="danger"
            onClick={handleDeleteFacts}
            disabled={deletingFacts || facts.length === 0}
          >
            {deletingFacts ? 'Deleting...' : 'Delete all stored facts'}
          </Button>
        </Card>

        {/* Account */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-2">Account</h2>
          <p className="text-sm text-gray-600 mb-4">Email: <span className="font-medium text-gray-900">{user?.email}</span></p>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-medium text-red-700 mb-1">Delete Account</h3>
            <p className="text-sm text-gray-500 mb-3">
              Permanently deletes your account, profile, all stored facts, documents, and application history. Cannot be undone.
            </p>
            <label className="text-sm font-medium text-gray-700 block mb-1">Type DELETE to confirm:</label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 w-full focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== 'DELETE' || deletingAccount}
            >
              {deletingAccount ? 'Deleting account...' : 'Permanently Delete Account'}
            </Button>
          </div>
        </Card>
      </div>
    </Sidebar>
  )
}
