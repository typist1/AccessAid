import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import Spinner from '../ui/Spinner'

export default function AuthGuard({ children }) {
  const { user } = useAuthContext()
  if (user === undefined) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}
