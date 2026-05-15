import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPackage } from '../api/packages.api'
import { PACKAGES_KEY } from './usePackages'

export function useCreatePackage() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PACKAGES_KEY })
    },
  })
}
