import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInstructor } from '../api/instructors.api'
import { INSTRUCTORS_KEY } from './useInstructors'

export function useCreateInstructor() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createInstructor,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INSTRUCTORS_KEY })
    },
  })
}
