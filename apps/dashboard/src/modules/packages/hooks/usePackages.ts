import { useQuery } from '@tanstack/react-query'
import { fetchPackages } from '../api/packages.api'

export const PACKAGES_KEY = ['packages']

export function usePackages() {
  return useQuery({
    queryKey: PACKAGES_KEY,
    queryFn: fetchPackages,
  })
}
