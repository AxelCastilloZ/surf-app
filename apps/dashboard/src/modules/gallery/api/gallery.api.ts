import { apiClient } from '@/core/api/client'
import type { GalleryItem, GalleryCategory } from '@surf-app/types'

export type { GalleryItem }

export interface UpdateGalleryItemPayload {
  category?: GalleryCategory
  alt_text?: string
  alt_text_en?: string
  is_visible?: boolean
  sort_order?: number
}

// Dashboard: llama /gallery/admin para ver TODOS los items (incluye no visibles)
// El apiClient inyecta el JWT automáticamente desde authStore
export async function fetchGalleryAdmin(category?: GalleryCategory): Promise<GalleryItem[]> {
  const path = category ? `/gallery/admin?category=${category}` : '/gallery/admin'
  const res = await apiClient<{ data: GalleryItem[] }>(path)
  return res.data ?? []
}

export async function uploadGalleryFile(formData: FormData): Promise<GalleryItem> {
  const res = await apiClient<{ data: GalleryItem }>('/gallery/upload', {
    method: 'POST',
    body: formData,
  })
  return res.data
}

export async function updateGalleryItem(
  id: string,
  payload: UpdateGalleryItemPayload,
): Promise<GalleryItem> {
  const res = await apiClient<{ data: GalleryItem }>(`/gallery/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function deleteGalleryItem(id: string): Promise<void> {
  return apiClient<void>(`/gallery/${id}`, { method: 'DELETE' })
}
