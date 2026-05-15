import { useQuery } from '@tanstack/react-query'
import type { Package } from '@surf-app/types'

const API_URL = import.meta.env.VITE_API_URL as string

async function fetchPackages(): Promise<Package[]> {
  const res = await fetch(`${API_URL}/packages`)
  if (!res.ok) throw new Error('Error al cargar los paquetes')

  const json = await res.json()
  // La API devuelve { data: Package[] }
  return Array.isArray(json) ? json : (json.data ?? [])
}

export function usePackages() {
  return useQuery({
    queryKey: ['packages'],
    queryFn: fetchPackages,
    staleTime: 1000 * 60 * 5, // 5 min
  })
}
