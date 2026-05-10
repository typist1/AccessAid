import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function QuickActions({ onSearch, onChat }) {
  return (
    <div className="flex gap-3 flex-wrap">
      <Link to="/documents">
        <Button variant="secondary">📄 Upload Document</Button>
      </Link>
      <Button variant="secondary" onClick={onSearch}>🔍 Search Programs</Button>
      <Button variant="secondary" onClick={onChat}>💬 Ask Assistant</Button>
    </div>
  )
}
