import { supabase } from '@/lib/supabase'

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
  const { data, error } = await supabase
    .from('service_pricing_tiers')
    .select('*')
    .order('service_type', { ascending: true })
    .order('min_participants', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as PricingTier[]
}

export async function createPricingTier(payload: PricingTierPayload): Promise<PricingTier> {
  const { data, error } = await supabase
    .from('service_pricing_tiers')
    .insert({
      ...payload,
      is_active: payload.is_active ?? true,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as PricingTier
}

export async function updatePricingTier(id: string, payload: Partial<PricingTierPayload>): Promise<PricingTier> {
  const { data, error } = await supabase
    .from('service_pricing_tiers')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as PricingTier
}

export async function deletePricingTier(id: string): Promise<void> {
  const { error } = await supabase.from('service_pricing_tiers').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
