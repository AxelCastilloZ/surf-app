import { useQuery } from '@tanstack/react-query'
import { fetchGalleryAdmin } from '../api/gallery.api'
import type { GalleryCategory } from '@surf-app/types'

export const GALLERY_KEY = ['gallery']

export function useGallery(category?: GalleryCategory) {
  return useQuery({
    queryKey: [...GALLERY_KEY, category ?? 'all'],
    queryFn: () => fetchGalleryAdmin(category),
  })
}
