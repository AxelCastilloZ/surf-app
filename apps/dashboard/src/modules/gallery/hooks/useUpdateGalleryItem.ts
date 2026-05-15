import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateGalleryItem, type UpdateGalleryItemPayload } from '../api/gallery.api'
import { GALLERY_KEY } from './useGallery'

export function useUpdateGalleryItem() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGalleryItemPayload }) =>
      updateGalleryItem(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GALLERY_KEY })
    },
  })
}
