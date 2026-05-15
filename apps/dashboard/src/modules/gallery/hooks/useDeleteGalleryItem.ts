import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteGalleryItem } from '../api/gallery.api'
import { GALLERY_KEY } from './useGallery'

export function useDeleteGalleryItem() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteGalleryItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GALLERY_KEY })
    },
  })
}
