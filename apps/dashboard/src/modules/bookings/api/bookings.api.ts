import { supabase } from '@/lib/supabase'

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

interface BookingRow {
  id: string
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
  clients: BookingClient
  packages: BookingPackage | null
  booking_instructors: { instructors: BookingInstructor }[]
}

function mapBooking(row: BookingRow): AdminBooking {
  return {
    id: row.id,
    client: row.clients,
    package: row.packages,
    instructors: (row.booking_instructors ?? []).map((bi) => bi.instructors),
    service_type: row.service_type,
    booking_date: row.booking_date,
    start_time: row.start_time,
    end_time: row.end_time,
    participants: row.participants,
    status: row.status,
    total_price: row.total_price,
    currency: row.currency,
    medical_notes: row.medical_notes,
    notes: row.notes,
    internal_notes: row.internal_notes,
    cancelled_reason: row.cancelled_reason,
    confirmed_at: row.confirmed_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

const BOOKING_SELECT = `
  id, service_type, booking_date, start_time, end_time,
  participants, status, total_price, currency,
  medical_notes, notes, internal_notes, cancelled_reason,
  confirmed_at, created_at, updated_at,
  clients (id, full_name, email, phone, country, language),
  packages (id, name, name_en, price, currency),
  booking_instructors (instructors (id, full_name, email, is_active))
`

export async function fetchBookings(status?: string): Promise<AdminBooking[]> {
  let query = supabase
    .from('bookings')
    .select(BOOKING_SELECT)
    .order('booking_date', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return ((data ?? []) as unknown as BookingRow[]).map(mapBooking)
}

export async function fetchBooking(id: string): Promise<AdminBooking> {
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_SELECT)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return mapBooking(data as unknown as BookingRow)
}

export async function updateBookingStatus(
  id: string,
  payload: { status: string; internal_notes?: string; cancelled_reason?: string },
): Promise<AdminBooking> {
  const { data, error } = await supabase.functions.invoke('update-booking-status', {
    body: { id, ...payload },
  })

  if (error) throw new Error(error.message)
  if (data?.error) throw new Error(data.error)
  return data.data as AdminBooking
}

export async function assignInstructors(
  id: string,
  instructorIds: string[],
): Promise<AdminBooking> {
  const { data, error } = await supabase.functions.invoke('assign-instructors', {
    body: { id, instructor_ids: instructorIds },
  })

  if (error) throw new Error(error.message)
  if (data?.error) throw new Error(data.error)
  return data.data as AdminBooking
}

export async function fetchInstructors(): Promise<BookingInstructor[]> {
  const { data, error } = await supabase
    .from('instructors')
    .select('id, full_name, email, is_active')
    .eq('is_active', true)
    .order('full_name', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as BookingInstructor[]
}
