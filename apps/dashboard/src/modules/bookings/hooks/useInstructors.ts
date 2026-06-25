import { useQuery } from '@tanstack/react-query'
import { fetchInstructors } from '../api/bookings.api'

export function useInstructors() {
  return useQuery({
    queryKey: ['instructors'],
    queryFn: fetchInstructors,
    staleTime: 1000 * 60 * 5,
  })
}
