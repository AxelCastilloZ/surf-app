import { apiClient } from '@/core/api/client'

export interface PricingTier {
  id: string
  service_type: string
  min_participants: number
  max_participants: number
  price_per_person: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PricingTierPayload {
  service_type: string
  min_participants: number
  max_participants: number
  price_per_person: number
  is_active?: boolean
}

export async function fetchPricingTiers(): Promise<PricingTier[]> {
  const res = await apiClient<{ data: PricingTier[] }>('/pricing/tiers')
  return res.data ?? []
}

export async function createPricingTier(payload: PricingTierPayload): Promise<PricingTier> {
  const res = await apiClient<{ data: PricingTier }>('/pricing/tiers', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function updatePricingTier(id: string, payload: Partial<PricingTierPayload>): Promise<PricingTier> {
  const res = await apiClient<{ data: PricingTier }>(`/pricing/tiers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function deletePricingTier(id: string): Promise<void> {
  return apiClient<void>(`/pricing/tiers/${id}`, { method: 'DELETE' })
}
