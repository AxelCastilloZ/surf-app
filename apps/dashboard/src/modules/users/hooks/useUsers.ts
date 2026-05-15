import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../api/users.api'

export const USERS_KEY = ['users']

export function useUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: fetchUsers,
  })
}
