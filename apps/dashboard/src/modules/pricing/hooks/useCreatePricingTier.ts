import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPricingTier } from '../api/pricing.api'
import { PRICING_TIERS_KEY } from './usePricingTiers'

export function useCreatePricingTier() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createPricingTier,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRICING_TIERS_KEY })
    },
  })
}
