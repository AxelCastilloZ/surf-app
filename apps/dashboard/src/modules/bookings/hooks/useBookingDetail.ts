import { useQuery } from '@tanstack/react-query'
import { fetchBooking } from '../api/bookings.api'

export function useBookingDetail(id: string | null) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => fetchBooking(id!),
    enabled: !!id,
  })
}
