import { useQuery } from '@tanstack/react-query'
import type { GalleryItem, GalleryCategory } from '@surf-app/types'
import { supabase } from '../../lib/supabase'

async function fetchGallery(category?: GalleryCategory): Promise<GalleryItem[]> {
  let query = supabase
    .from('gallery_items')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw new Error('Error al cargar la galería')
  return (data ?? []) as unknown as GalleryItem[]
}

export function useGallery(category?: GalleryCategory) {
  return useQuery({
    queryKey: ['gallery', category ?? 'all'],
    queryFn: () => fetchGallery(category),
    staleTime: 1000 * 60 * 5,
  })
}
