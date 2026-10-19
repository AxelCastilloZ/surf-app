import { supabase } from '@/lib/supabase'

const STORAGE_BUCKET = 'gallery'

export interface Instructor {
  id: string
  full_name: string
  email: string
  photo_url: string | null
  storage_path: string | null
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
  const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .order('full_name', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as Instructor[]
}

export async function createInstructor(payload: InstructorPayload): Promise<Instructor> {
  const { data, error } = await supabase
    .from('instructors')
    .insert({
      ...payload,
      is_active: payload.is_active ?? true,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Instructor
}

export async function updateInstructor(id: string, payload: Partial<InstructorPayload>): Promise<Instructor> {
  const { data, error } = await supabase
    .from('instructors')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Instructor
}

export async function deleteInstructor(id: string): Promise<void> {
  const { data: inst } = await supabase
    .from('instructors')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (inst?.storage_path) {
    await supabase.storage.from(STORAGE_BUCKET).remove([inst.storage_path])
  }

  const { error } = await supabase.from('instructors').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function uploadInstructorPhoto(id: string, file: File): Promise<Instructor> {
  const { data: existing } = await supabase
    .from('instructors')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (existing?.storage_path) {
    await supabase.storage.from(STORAGE_BUCKET).remove([existing.storage_path])
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const storagePath = `instructors/${safeName}`

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false })

  if (uploadError) throw new Error(`Error al subir imagen: ${uploadError.message}`)

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath)

  const { data, error } = await supabase
    .from('instructors')
    .update({ photo_url: publicUrl, storage_path: storagePath })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Instructor
}
