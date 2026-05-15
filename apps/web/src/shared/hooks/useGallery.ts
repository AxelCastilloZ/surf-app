import { useQuery } from '@tanstack/react-query'
import type { GalleryItem, GalleryCategory } from '@surf-app/types'

const API_URL = import.meta.env.VITE_API_URL as string

async function fetchGallery(category?: GalleryCategory): Promise<GalleryItem[]> {
  const url = new URL(`${API_URL}/gallery`)
  if (category) url.searchParams.set('category', category)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Error al cargar la galería')

  const json = await res.json()
  // La API devuelve { data: GalleryItem[] }
  return Array.isArray(json) ? json : (json.data ?? [])
}

export function useGallery(category?: GalleryCategory) {
  return useQuery({
    queryKey: ['gallery', category ?? 'all'],
    queryFn: () => fetchGallery(category),
    staleTime: 1000 * 60 * 5, // 5 min
  })
}
