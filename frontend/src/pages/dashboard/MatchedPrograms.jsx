import ProgramCard from '../../components/programs/ProgramCard'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

export default function MatchedPrograms({ programs, loading, onRefresh, refreshing }) {
  const visible = programs.filter(p => p.eligibility_score !== 'unlikely')

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Matched Programs</h2>
        <Button variant="ghost" onClick={onRefresh} disabled={refreshing} className="text-sm">
          {refreshing ? 'Refreshing...' : 'Refresh Matches'}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : visible.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No matches yet.</p>
          <Button variant="secondary" onClick={onRefresh} className="mt-3">Run Eligibility Check</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map(up => <ProgramCard key={up.id} userProgram={up} />)}
        </div>
      )}
    </section>
  )
}
