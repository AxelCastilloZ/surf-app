import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePricingTier } from '../api/pricing.api'
import { PRICING_TIERS_KEY } from './usePricingTiers'

export function useDeletePricingTier() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deletePricingTier,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRICING_TIERS_KEY })
    },
  })
}
