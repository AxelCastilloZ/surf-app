import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '../api/users.api'
import { USERS_KEY } from './useUsers'

export function useCreateUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY })
    },
  })
}
