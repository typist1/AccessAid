import { useAuthContext } from '../context/AuthContext'
import { signIn, signOut, signUp, signInWithGoogle } from '../lib/auth'

export function useAuth() {
  const { user } = useAuthContext()
  return { user, signIn, signOut, signUp, signInWithGoogle }
}
