import { useQuery } from '@tanstack/react-query'
import { fetchPricingTiers } from '../api/pricing.api'

export const PRICING_TIERS_KEY = ['pricing-tiers']

export function usePricingTiers() {
  return useQuery({
    queryKey: PRICING_TIERS_KEY,
    queryFn: fetchPricingTiers,
  })
}
