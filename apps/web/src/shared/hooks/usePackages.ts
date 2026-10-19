import { useQuery } from '@tanstack/react-query'
import type { Package } from '@surf-app/types'
import { supabase } from '../../lib/supabase'

async function fetchPackages(): Promise<Package[]> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) throw new Error('Error al cargar los paquetes')
  return (data ?? []) as unknown as Package[]
}

export function usePackages() {
  return useQuery({
    queryKey: ['packages'],
    queryFn: fetchPackages,
    staleTime: 1000 * 60 * 5,
  })
}
