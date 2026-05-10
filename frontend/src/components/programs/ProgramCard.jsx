import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Card from '../ui/Card'

const SCORE_LABEL = { strong: '✅ Strong Match', possible: '🟡 Possible Match', unlikely: '🔴 Unlikely' }

export default function ProgramCard({ userProgram }) {
  const { program_id, eligibility_score, notes, missing_docs, programs: prog } = userProgram
  if (!prog) return null

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{prog.name}</h3>
          <Badge variant={prog.category}>{prog.category}</Badge>
        </div>
        <Badge variant={eligibility_score}>{SCORE_LABEL[eligibility_score]}</Badge>
      </div>

      {notes && <p className="text-sm text-gray-600">{notes}</p>}

      {missing_docs?.length > 0 && (
        <p className="text-xs text-yellow-700 bg-yellow-50 rounded px-2 py-1">
          Missing: {missing_docs.join(', ')}
        </p>
      )}

      <div className="flex gap-2 mt-auto">
        <Link to={`/programs/${program_id}`} className="flex-1">
          <Button variant="secondary" className="w-full text-sm">Learn More</Button>
        </Link>
        <Link to={`/programs/${program_id}/apply`} className="flex-1">
          <Button className="w-full text-sm">Apply</Button>
        </Link>
      </div>
    </Card>
  )
}
