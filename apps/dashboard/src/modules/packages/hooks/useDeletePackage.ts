import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePackage } from '../api/packages.api'
import { PACKAGES_KEY } from './usePackages'

export function useDeletePackage() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PACKAGES_KEY })
    },
  })
}
