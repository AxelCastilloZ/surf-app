import { supabase } from '@/lib/supabase'
import type { GalleryItem, GalleryCategory } from '@surf-app/types'

export type { GalleryItem }

export interface UpdateGalleryItemPayload {
  category?: GalleryCategory
  alt_text?: string
  alt_text_en?: string
  is_visible?: boolean
  sort_order?: number
}

const STORAGE_BUCKET = 'gallery'

export async function fetchGalleryAdmin(category?: GalleryCategory): Promise<GalleryItem[]> {
  let query = supabase
    .from('gallery_items')
    .select('*')
    .order('sort_order', { ascending: true })

  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as GalleryItem[]
}

export async function uploadGalleryFile(formData: FormData): Promise<GalleryItem> {
  const file = formData.get('file') as File
  const category = (formData.get('category') as string) ?? 'general'
  const altText = formData.get('alt_text') as string | null
  const altTextEn = formData.get('alt_text_en') as string | null

  if (!file) throw new Error('No se recibió ningún archivo')

  const isVideo = file.type.startsWith('video/')
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const folder = isVideo ? 'videos' : 'images'
  const storagePath = `${folder}/${category}/${safeName}`

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false })

  if (uploadError) throw new Error(`Error al subir: ${uploadError.message}`)

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath)

  const { data, error } = await supabase
    .from('gallery_items')
    .insert({
      url: publicUrl,
      storage_path: storagePath,
      media_type: isVideo ? 'video' : 'image',
      category,
      alt_text: altText,
      alt_text_en: altTextEn,
      is_visible: true,
      sort_order: 0,
    })
    .select()
    .single()

  if (error) {
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
    throw new Error(error.message)
  }

  return data as unknown as GalleryItem
}

export async function updateGalleryItem(
  id: string,
  payload: UpdateGalleryItemPayload,
): Promise<GalleryItem> {
  const { data, error } = await supabase
    .from('gallery_items')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as unknown as GalleryItem
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const { data: item } = await supabase
    .from('gallery_items')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (item?.storage_path) {
    await supabase.storage.from(STORAGE_BUCKET).remove([item.storage_path])
  }

  const { error } = await supabase.from('gallery_items').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
