import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBookingStatus, assignInstructors } from '../api/bookings.api'
import { BOOKINGS_KEY } from './useBookings'

export function useUpdateBookingStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status: string; internal_notes?: string; cancelled_reason?: string } }) =>
      updateBookingStatus(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: BOOKINGS_KEY })
      qc.invalidateQueries({ queryKey: ['booking', vars.id] })
    },
  })
}

export function useAssignInstructors() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, instructorIds }: { id: string; instructorIds: string[] }) =>
      assignInstructors(id, instructorIds),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: BOOKINGS_KEY })
      qc.invalidateQueries({ queryKey: ['booking', vars.id] })
    },
  })
}
