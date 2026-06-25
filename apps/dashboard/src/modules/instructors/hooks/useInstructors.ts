import { useQuery } from '@tanstack/react-query'
import { fetchInstructors } from '../api/instructors.api'

export const INSTRUCTORS_KEY = ['instructors']

export function useInstructors() {
  return useQuery({
    queryKey: INSTRUCTORS_KEY,
    queryFn: fetchInstructors,
  })
}
