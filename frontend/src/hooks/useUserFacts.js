import { useUserContext } from '../context/UserContext'

export function useUserFacts() {
  const { facts, upsertFact, fetchFacts } = useUserContext()
  return { facts, upsertFact, fetchFacts }
}
