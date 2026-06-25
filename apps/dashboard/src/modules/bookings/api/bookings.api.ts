import { apiClient } from '@/core/api/client'

export interface BookingInstructor {
  id: string
  full_name: string
  email: string
  is_active: boolean
}

export interface BookingClient {
  id: string
  full_name: string
  email: string
  phone?: string
  country?: string
  language?: string
}

export interface BookingPackage {
  id: string
  name: string
  name_en: string
  price: number
  currency: string
}

export interface AdminBooking {
  id: string
  client: BookingClient
  package: BookingPackage | null
  instructors: BookingInstructor[]
  service_type: string
  booking_date: string
  start_time: string
  end_time: string | null
  participants: number
  status: string
  total_price: number
  currency: string
  medical_notes: string
  notes: string | null
  internal_notes: string | null
  cancelled_reason: string | null
  confirmed_at: string | null
  created_at: string
  updated_at: string
}

export async function fetchBookings(status?: string): Promise<AdminBooking[]> {
  const query = status ? `?status=${status}` : ''
  const res = await apiClient<{ data: AdminBooking[] }>(`/bookings/admin${query}`)
  return res.data ?? []
}

export async function fetchBooking(id: string): Promise<AdminBooking> {
  const res = await apiClient<{ data: AdminBooking }>(`/bookings/admin/${id}`)
  return res.data
}

export async function updateBookingStatus(
  id: string,
  payload: { status: string; internal_notes?: string; cancelled_reason?: string },
): Promise<AdminBooking> {
  const res = await apiClient<{ data: AdminBooking }>(`/bookings/admin/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function assignInstructors(
  id: string,
  instructorIds: string[],
): Promise<AdminBooking> {
  const res = await apiClient<{ data: AdminBooking }>(`/bookings/admin/${id}/instructors`, {
    method: 'PATCH',
    body: JSON.stringify({ instructor_ids: instructorIds }),
  })
  return res.data
}

export async function fetchInstructors(): Promise<BookingInstructor[]> {
  const res = await apiClient<{ data: BookingInstructor[] }>('/instructors')
  return res.data ?? []
}
