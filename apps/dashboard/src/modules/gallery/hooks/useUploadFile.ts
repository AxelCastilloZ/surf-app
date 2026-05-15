import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadGalleryFile } from '../api/gallery.api'
import { GALLERY_KEY } from './useGallery'

export function useUploadFile() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: uploadGalleryFile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GALLERY_KEY })
    },
  })
}
