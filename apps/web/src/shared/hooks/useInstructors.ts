import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export interface PublicInstructor {
  id: string
  full_name: string
  email: string
  photo_url: string | null
  bio: string | null
  bio_en: string | null
  is_active: boolean
}

async function fetchPublicInstructors(): Promise<PublicInstructor[]> {
  const { data, error } = await supabase
    .from('instructors')
    .select('id, full_name, email, photo_url, bio, bio_en, is_active')
    .eq('is_active', true)
    .order('full_name', { ascending: true })

  if (error) throw new Error('Error al cargar instructores')
  return (data ?? []) as PublicInstructor[]
}

async function fetchPublicInstructor(id: string): Promise<PublicInstructor> {
  const { data, error } = await supabase
    .from('instructors')
    .select('id, full_name, email, photo_url, bio, bio_en, is_active')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !data) throw new Error('Instructor no encontrado')
  return data as PublicInstructor
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
