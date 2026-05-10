import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Badge from '../../components/ui/Badge'

export default function ApplicationTracker({ programs }) {
  const { t } = useTranslation()

  const STATUS_LABEL = {
    matched: t('dashboard.status_not_started'),
    in_progress: t('dashboard.status_in_progress'),
    submitted: t('dashboard.status_submitted'),
    approved: t('dashboard.status_approved'),
    denied: t('dashboard.status_denied'),
  }

  const acted = programs.filter(p => p.status !== 'matched')
  if (acted.length === 0) return null

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{t('dashboard.tracker_title')}</h2>
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t('dashboard.tracker_col_program')}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t('dashboard.tracker_col_status')}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t('dashboard.tracker_col_missing')}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t('dashboard.tracker_col_deadline')}</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">{t('dashboard.tracker_col_action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {acted.map(p => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {p.programs?.name ?? t('application_form.unknown_program')}
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
                      {t('dashboard.action_continue')}
                    </Link>
                  )}
                  {p.status === 'submitted' && (
                    <Link to={`/programs/${p.program_id}`} className="text-blue-600 hover:underline">
                      {t('dashboard.action_view')}
                    </Link>
                  )}
                  {p.status === 'approved' && (
                    <Link to={`/programs/${p.program_id}`} className="text-green-600 hover:underline">
                      {t('dashboard.action_view')}
                    </Link>
                  )}
                  {p.status === 'denied' && (
                    <Link to={`/programs/${p.program_id}/apply`} className="text-red-600 hover:underline">
                      {t('dashboard.action_appeal')}
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
