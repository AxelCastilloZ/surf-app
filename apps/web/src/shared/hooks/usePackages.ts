import { useQuery } from '@tanstack/react-query'
import { fetchPackages } from '../api/packages'

export function usePackages() {
  return useQuery({
    queryKey: ['packages'],
    queryFn: fetchPackages,
    select: (res) => res.data,
  })
}
