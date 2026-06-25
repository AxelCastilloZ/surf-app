import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL as string

export interface PublicInstructor {
  id: string
  full_name: string
  email: string
  photo_url: string | null
  bio: string | null
  is_active: boolean
}

async function fetchPublicInstructors(): Promise<PublicInstructor[]> {
  const res = await fetch(`${API_URL}/instructors/public`)
  if (!res.ok) throw new Error('Error al cargar instructores')
  const json = await res.json()
  return json.data ?? []
}

async function fetchPublicInstructor(id: string): Promise<PublicInstructor> {
  const res = await fetch(`${API_URL}/instructors/public/${id}`)
  if (!res.ok) throw new Error('Instructor no encontrado')
  const json = await res.json()
  return json.data
}

export function usePublicInstructors() {
  return useQuery({
    queryKey: ['instructors', 'public'],
    queryFn: fetchPublicInstructors,
    staleTime: 1000 * 60 * 5,
  })
}

export function usePublicInstructor(id: string) {
  return useQuery({
    queryKey: ['instructors', 'public', id],
    queryFn: () => fetchPublicInstructor(id),
    staleTime: 1000 * 60 * 5,
  })
}
