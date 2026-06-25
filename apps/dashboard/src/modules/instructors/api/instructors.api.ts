import { apiClient } from '@/core/api/client'

export interface Instructor {
  id: string
  full_name: string
  email: string
  photo_url: string | null
  bio: string | null
  google_calendar_id: string | null
  dashboard_user_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InstructorPayload {
  full_name: string
  email: string
  bio?: string
  google_calendar_id?: string
  dashboard_user_id?: string
  is_active?: boolean
}

export async function fetchInstructors(): Promise<Instructor[]> {
  const res = await apiClient<{ data: Instructor[] }>('/instructors')
  return res.data ?? []
}

export async function createInstructor(payload: InstructorPayload): Promise<Instructor> {
  const res = await apiClient<{ data: Instructor }>('/instructors', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function updateInstructor(id: string, payload: Partial<InstructorPayload>): Promise<Instructor> {
  const res = await apiClient<{ data: Instructor }>(`/instructors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function deleteInstructor(id: string): Promise<void> {
  return apiClient<void>(`/instructors/${id}`, { method: 'DELETE' })
}

export async function uploadInstructorPhoto(id: string, file: File): Promise<Instructor> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiClient<{ data: Instructor }>(`/instructors/${id}/photo`, {
    method: 'POST',
    body: formData,
  })
  return res.data
}
