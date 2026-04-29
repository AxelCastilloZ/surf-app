import { useQuery } from '@tanstack/react-query'
import type { GalleryCategory } from '@surf-app/types'
import { fetchGallery } from '../api/gallery'

export function useGallery(category?: GalleryCategory) {
  return useQuery({
    queryKey: ['gallery', category],
    queryFn: () => fetchGallery(category),
    select: (res) => res.data,
  })
}
