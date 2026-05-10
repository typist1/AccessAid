import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../lib/supabase'
import Spinner from '../../components/ui/Spinner'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/login'); return }

      const { data: profile } = await supabase
        .from('user_profile')
        .select('user_id')
        .eq('user_id', session.user.id)
        .single()

      navigate(profile ? '/dashboard' : '/onboarding')
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner />
    </div>
  )
}
