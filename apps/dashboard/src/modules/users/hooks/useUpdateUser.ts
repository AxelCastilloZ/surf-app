import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '../api/users.api'
import { USERS_KEY } from './useUsers'

export function useUpdateUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateUser>[1] }) =>
      updateUser(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY })
    },
  })
}
