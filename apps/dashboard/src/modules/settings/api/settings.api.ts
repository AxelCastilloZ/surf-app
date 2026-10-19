import { supabase } from '@/lib/supabase'

const STORAGE_BUCKET = 'gallery'

export interface SiteSetting {
  key: string
  value: string
  updated_at: string
}

export async function fetchSetting(key: string): Promise<SiteSetting> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single()

  if (error) throw new Error(`Setting "${key}" no encontrada`)
  return data as SiteSetting
}

export async function updateSetting(key: string, value: string): Promise<SiteSetting> {
  const { data: existing } = await supabase
    .from('site_settings')
    .select('key')
    .eq('key', key)
    .single()

  if (existing) {
    const { data, error } = await supabase
      .from('site_settings')
      .update({ value })
      .eq('key', key)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as SiteSetting
  }

  const { data, error } = await supabase
    .from('site_settings')
    .insert({ key, value })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as SiteSetting
}

export async function uploadHeroImage(file: File): Promise<{ url: string }> {
  const { data: existing } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'hero_storage_path')
    .single()

  if (existing?.value) {
    await supabase.storage.from(STORAGE_BUCKET).remove([existing.value])
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const storagePath = `site/${safeName}`

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false })

  if (uploadError) throw new Error(`Error al subir imagen: ${uploadError.message}`)

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath)

  await updateSetting('hero_image_url', publicUrl)
  await updateSetting('hero_storage_path', storagePath)

  return { url: publicUrl }
}
