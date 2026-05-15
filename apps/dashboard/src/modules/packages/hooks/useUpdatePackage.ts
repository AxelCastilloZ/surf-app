import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePackage } from '../api/packages.api'
import { PACKAGES_KEY } from './usePackages'

export function useUpdatePackage() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updatePackage>[1] }) =>
      updatePackage(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PACKAGES_KEY })
    },
  })
}
