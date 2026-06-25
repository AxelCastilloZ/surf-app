import { useQuery } from '@tanstack/react-query'
import { fetchBookings } from '../api/bookings.api'

export const BOOKINGS_KEY = ['bookings']

export function useBookings(status?: string) {
  return useQuery({
    queryKey: [...BOOKINGS_KEY, status],
    queryFn: () => fetchBookings(status),
  })
}
