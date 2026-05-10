import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../../lib/supabase'
import { useAuthContext } from '../../context/AuthContext'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'

export default function SearchModal({ open, onClose, onAdded }) {
  const { user } = useAuthContext()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  async function search(q) {
    setLoading(true)
    const { data: programs } = await supabase
      .from('programs')
      .select('id, name, category, description_en')
      .or(`name.ilike.%${q}%,category.ilike.%${q}%`)
      .limit(10)

    const found = programs ?? []

    if (found.length && user) {
      const { data: scores } = await supabase
        .from('user_programs')
        .select('program_id, eligibility_score')
        .eq('user_id', user.id)
        .in('program_id', found.map(p => p.id))

      const scoreMap = Object.fromEntries((scores ?? []).map(s => [s.program_id, s.eligibility_score]))
      setResults(found.map(p => ({ ...p, eligibility_score: scoreMap[p.id] ?? null })))
    } else {
      setResults(found)
    }

    setLoading(false)
  }

  async function handleAddManual() {
    if (!newName.trim()) return
    setAdding(true)
    const { data: prog } = await supabase.from('programs').insert({
      name: newName,
      category: 'other',
      description_en: '',
      application_url: newUrl,
      eligibility_rules: {},
      is_user_added: true,
    }).select().single()

    await supabase.from('user_programs').insert({
      user_id: user.id,
      program_id: prog.id,
      eligibility_score: 'possible',
      status: 'matched',
      notes: 'User-added program',
    })

    setAdding(false)
    onAdded?.()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Search Programs">
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search by name or category..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />

        {loading && <div className="flex justify-center"><Spinner size={6} /></div>}

        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {results.map(prog => (
            <Link
              key={prog.id}
              to={`/programs/${prog.id}`}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900 text-sm">{prog.name}</span>
              <div className="flex items-center gap-2">
                {prog.eligibility_score && (
                  <Badge variant={prog.eligibility_score}>{prog.eligibility_score}</Badge>
                )}
                <Badge variant={prog.category}>{prog.category}</Badge>
              </div>
            </Link>
          ))}
        </div>

        {!showAdd ? (
          <button
            onClick={() => setShowAdd(true)}
            className="text-sm text-blue-600 hover:underline text-left"
          >
            + Add a program manually
          </button>
        ) : (
          <div className="border-t pt-3 flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-700">Add program manually</p>
            <Input placeholder="Program name" value={newName} onChange={e => setNewName(e.target.value)} />
            <Input placeholder="Application URL (optional)" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
            <Button onClick={handleAddManual} disabled={adding || !newName.trim()}>
              {adding ? 'Adding...' : 'Add Program'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
