import { Navigate } from 'react-router-dom'
import { useUserContext } from '../../context/UserContext'
import Spinner from '../ui/Spinner'

export default function OnboardingGuard({ children }) {
  const { profile } = useUserContext()
  if (profile === undefined) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>
  if (profile === null) return <Navigate to="/onboarding" replace />
  return children
}
