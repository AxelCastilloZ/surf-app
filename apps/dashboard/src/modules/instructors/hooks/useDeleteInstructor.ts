import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteInstructor } from '../api/instructors.api'
import { INSTRUCTORS_KEY } from './useInstructors'

export function useDeleteInstructor() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteInstructor,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INSTRUCTORS_KEY })
    },
  })
}
