import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import supabase from '../../lib/supabase'
import { useAuthContext } from '../../context/AuthContext'
import Sidebar from '../../components/layout/Sidebar'
import FormRenderer from '../../components/forms/FormRenderer'
import ChatPanel from '../../components/chat/ChatPanel'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import { getFormSchema } from '../../components/forms/schemas'

export default function ApplicationForm() {
  const { id } = useParams()
  const { user } = useAuthContext()
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('in_progress')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('programs').select('*').eq('id', id).single(),
      supabase.from('user_programs').select('status').eq('program_id', id).eq('user_id', user.id).single(),
    ]).then(([{ data: prog }, { data: up }]) => {
      setProgram(prog)
      if (up?.status && up.status !== 'matched') setStatus(up.status)
      setLoading(false)
    })

    // Mark as in_progress
    supabase.from('user_programs')
      .update({ status: 'in_progress' })
      .eq('program_id', id)
      .eq('user_id', user.id)
  }, [id])

  async function handleStatusChange(newStatus) {
    await supabase.from('user_programs')
      .update({ status: newStatus })
      .eq('program_id', id)
      .eq('user_id', user.id)
    setStatus(newStatus)
    if (newStatus === 'submitted') setSubmitted(true)
  }

  if (loading) return <Sidebar><div className="flex justify-center py-20"><Spinner /></div></Sidebar>

  const schema = getFormSchema(program?.name)
  const programContext = program ? `Program: ${program.name}\nDescription: ${program.description_en}\nEligibility rules: ${JSON.stringify(program.eligibility_rules)}` : null

  return (
    <Sidebar>
      <div className="flex h-[calc(100vh-0px)]">
        {/* Form side */}
        <div className="flex-1 overflow-y-auto p-6">
          <Link to={`/programs/${id}`} className="text-sm text-blue-600 hover:underline">← Back to Program</Link>

          <div className="max-w-2xl mx-auto mt-4">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{program?.name} Application</h1>
              <Badge variant={status}>{status.replace('_', ' ')}</Badge>
            </div>

            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-green-800 font-medium">Application marked as submitted!</p>
                <p className="text-green-700 text-sm mt-1">
                  Remember to save your confirmation number. Submit directly at{' '}
                  {program?.application_url && <a href={program.application_url} target="_blank" rel="noopener noreferrer" className="underline">the official site</a>}.
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6 text-sm text-blue-800">
              Fields highlighted in <strong>blue</strong> were auto-filled from your profile. Fields in <strong>yellow</strong> still need your input.
            </div>

            <FormRenderer schema={schema} onStatusChange={handleStatusChange} />

            {!submitted && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleStatusChange('submitted')}
                  className="text-sm text-gray-600 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
                >
                  I've submitted on the official site
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat side */}
        <div className="w-96 shrink-0 border-l border-gray-200 flex flex-col">
          <ChatPanel programName={program?.name} programContext={programContext} />
        </div>
      </div>
    </Sidebar>
  )
}
