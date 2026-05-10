import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import supabase from '../../lib/supabase'
import { useAuthContext } from '../../context/AuthContext'
import { useUserContext } from '../../context/UserContext'
import { scoreEligibility } from '../../lib/eligibilityEngine'
import { PROGRAMS } from '../../data/programs'
import Sidebar from '../../components/layout/Sidebar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

// Maps program required_documents keys → document types the user may have uploaded
const DOC_TYPE_MAP = {
  government_issued_id: ['drivers_license', 'passport'],
  proof_of_residency: ['utility_bill', 'lease_agreement', 'drivers_license'],
  proof_of_income: ['w2', 'pay_stub'],
  proof_of_income_last_30_days: ['pay_stub'],
  social_security_number: ['social_security_card'],
  proof_of_citizenship_or_immigration_status: ['passport'],
  proof_of_citizenship: ['passport'],
  proof_of_household_size: ['birth_certificate'],
  proof_of_age: ['drivers_license', 'passport', 'birth_certificate'],
  proof_of_identity: ['drivers_license', 'passport'],
  lease_agreement: ['lease_agreement'],
  most_recent_utility_bill: ['utility_bill'],
  proof_of_program_participation: [],
  medical_records_if_disability: [],
  birth_certificate: ['birth_certificate'],
  w2s_or_self_employment_tax_returns_last_year: ['w2'],
  w2s_or_self_employment_tax_returns: ['w2'],
  wage_records_or_recent_pay_stubs: ['pay_stub', 'w2'],
}

function hasDoc(requiredKey, uploadedSet) {
  const types = DOC_TYPE_MAP[requiredKey] ?? []
  return types.some(t => uploadedSet.has(t))
}

export default function ProgramDetail() {
  const { id } = useParams()
  const { user } = useAuthContext()
  const { profile } = useUserContext()
  const [program, setProgram] = useState(null)
  const [userProgram, setUserProgram] = useState(null)
  const [uploadedDocTypes, setUploadedDocTypes] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const prog = PROGRAMS.find(p => p.id === id) ?? null
    setProgram(prog)

    if (prog && profile) {
      const { score, missing } = scoreEligibility(profile, prog)
      setUserProgram({ eligibility_score: score, missing_docs: missing, notes: null })
    }

    supabase
      .from('documents')
      .select('document_type')
      .eq('user_id', user.id)
      .eq('extraction_status', 'completed')
      .then(({ data: docs }) => {
        setUploadedDocTypes(new Set((docs ?? []).map(d => d.document_type)))
        setLoading(false)
      })
  }, [id, profile])

  if (loading) return <Sidebar><div className="flex justify-center py-20"><Spinner /></div></Sidebar>
  if (!program) return <Sidebar><p className="p-8 text-gray-500">Program not found.</p></Sidebar>

  const SCORE_LABEL = { strong: '✅ Strong Match', possible: '🟡 Possible Match', unlikely: '🔴 Unlikely' }

  return (
    <Sidebar>
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>

        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{program.name}</h1>
            {userProgram && (
              <Badge variant={userProgram.eligibility_score}>
                {SCORE_LABEL[userProgram.eligibility_score]}
              </Badge>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <Badge variant={program.category}>{program.category}</Badge>
            {program.application_url && (
              <a href={program.application_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                Official Site →
              </a>
            )}
          </div>
          <div>
            <Link to={`/programs/${id}/apply`}>
              <Button>Start Application</Button>
            </Link>
          </div>
        </div>

        {/* Description */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-2">What is this program?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{program.description_en}</p>
        </section>

        {/* Why you may qualify */}
        {userProgram?.notes && (
          <section className="bg-blue-50 rounded-xl border border-blue-100 p-5">
            <h2 className="font-semibold text-blue-900 mb-2">Why you may qualify</h2>
            <p className="text-blue-800 text-sm leading-relaxed">{userProgram.notes}</p>
            <p className="text-xs text-blue-600 mt-2 italic">
              This is informational guidance only and does not constitute legal or financial advice.
            </p>
          </section>
        )}

        {/* Missing info */}
        {userProgram?.missing_docs?.length > 0 && (
          <section className="bg-yellow-50 rounded-xl border border-yellow-100 p-5">
            <h2 className="font-semibold text-yellow-900 mb-2">Potential eligibility concerns</h2>
            <ul className="flex flex-col gap-1">
              {userProgram.missing_docs.map(item => (
                <li key={item} className="text-yellow-800 text-sm">⚠ {item.replace(/_/g, ' ')}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Required documents */}
        {program.required_documents?.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Required Documents</h2>
            <ul className="flex flex-col gap-2">
              {program.required_documents.map(doc => {
                const uploaded = hasDoc(doc, uploadedDocTypes)
                return (
                  <li key={doc} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{doc.replace(/_/g, ' ')}</span>
                    <span className={uploaded ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                      {uploaded ? '✅ On file' : '❌ Missing'}
                    </span>
                  </li>
                )
              })}
            </ul>
            <Link to="/documents" className="mt-4 inline-block">
              <Button variant="secondary" className="text-sm">Upload Documents</Button>
            </Link>
          </section>
        )}

        {/* Next steps */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Review eligibility requirements above</li>
            <li>Upload any missing documents</li>
            <li>Click "Start Application" to begin with AI assistance</li>
            {program.application_url && (
              <li>
                <a href={program.application_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Submit through the official site
                </a>
              </li>
            )}
          </ol>
        </section>
      </div>
    </Sidebar>
  )
}
