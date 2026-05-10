import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function QuickActions({ onSearch, onChat }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Link to="/documents">
        <Button variant="secondary" className="text-sm">Upload Document</Button>
      </Link>
      <Button variant="secondary" className="text-sm" onClick={onSearch}>Search Programs</Button>
      <Button variant="secondary" className="text-sm" onClick={onChat}>Ask Assistant</Button>
    </div>
  )
}
