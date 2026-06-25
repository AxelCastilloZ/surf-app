import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePricingTier } from '../api/pricing.api'
import { PRICING_TIERS_KEY } from './usePricingTiers'

export function useUpdatePricingTier() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updatePricingTier>[1] }) =>
      updatePricingTier(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRICING_TIERS_KEY })
    },
  })
}
