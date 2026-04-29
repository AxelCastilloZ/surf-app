import type { ApiResponse, GalleryCategory, GalleryItem } from '@surf-app/types'
import { apiFetch } from './client'

export function fetchGallery(category?: GalleryCategory): Promise<ApiResponse<GalleryItem[]>> {
  const params = category ? `?category=${category}` : ''
  return apiFetch<ApiResponse<GalleryItem[]>>(`/gallery${params}`)
}
