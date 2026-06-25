import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateInstructor } from '../api/instructors.api'
import { INSTRUCTORS_KEY } from './useInstructors'

export function useUpdateInstructor() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateInstructor>[1] }) =>
      updateInstructor(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INSTRUCTORS_KEY })
    },
  })
}
