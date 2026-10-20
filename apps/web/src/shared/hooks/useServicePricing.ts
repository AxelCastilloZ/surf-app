import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

interface PricingTier {
  service_type: string
  price_per_person: number
}

async function fetchServicePricing(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('service_pricing_tiers')
    .select('service_type, price_per_person')
    .eq('is_active', true)

  if (error) throw new Error('Error al cargar precios')

  const mins: Record<string, number> = {}
  for (const row of (data ?? []) as PricingTier[]) {
    if (!(row.service_type in mins) || row.price_per_person < mins[row.service_type]) {
      mins[row.service_type] = row.price_per_person
    }
  }
  return mins
}

export function useServicePricing() {
  return useQuery({
    queryKey: ['service-pricing'],
    queryFn: fetchServicePricing,
    staleTime: 1000 * 60 * 5,
  })
}
