import { Link } from 'react-router-dom'
import Badge from '../../components/ui/Badge'

const STATUS_LABEL = {
  matched: 'Not started',
  in_progress: 'In progress',
  submitted: 'Submitted',
  approved: 'Approved',
  denied: 'Denied',
}

export default function ApplicationTracker({ programs }) {
  const acted = programs.filter(p => p.status !== 'matched')
  if (acted.length === 0) return null

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Application Tracker</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Program</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Missing Docs</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Deadline</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {acted.map(p => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {p.programs?.name ?? 'Unknown Program'}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={p.status}>{STATUS_LABEL[p.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-red-600 text-xs">
                  {p.missing_docs?.length > 0
                    ? p.missing_docs.map(d => d.replace(/_/g, ' ')).join(', ')
                    : <span className="text-gray-400">—</span>
                  }
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {p.programs?.deadline ?? <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  {p.status === 'in_progress' && (
                    <Link to={`/programs/${p.program_id}/apply`} className="text-blue-600 hover:underline">
                      Continue
                    </Link>
                  )}
                  {p.status === 'submitted' && (
                    <Link to={`/programs/${p.program_id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  )}
                  {p.status === 'approved' && (
                    <Link to={`/programs/${p.program_id}`} className="text-green-600 hover:underline">
                      View
                    </Link>
                  )}
                  {p.status === 'denied' && (
                    <Link to={`/programs/${p.program_id}/apply`} className="text-red-600 hover:underline">
                      Appeal Help
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
