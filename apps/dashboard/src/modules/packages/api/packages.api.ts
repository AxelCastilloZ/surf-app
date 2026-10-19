import { supabase } from '@/lib/supabase'

export interface SurfPackage {
  id: string
  name: string
  name_en: string
  description: string
  description_en: string
  price: number
  currency: string
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  title_es: string
  title_en: string
  description_es: string
  duration_days?: number
}

function mapPackage(row: Record<string, unknown>): SurfPackage {
  return {
    ...(row as Omit<SurfPackage, 'title_es' | 'title_en' | 'description_es'>),
    title_es: row.name as string,
    title_en: row.name_en as string,
    description_es: row.description as string,
  }
}

export interface PackagePayload {
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  price: number
  duration_days?: number
  currency?: string
  is_active?: boolean
  sort_order?: number
}

function payloadToDb(p: Partial<PackagePayload>) {
  const mapped: Record<string, unknown> = {}
  if (p.title_es !== undefined) mapped.name = p.title_es
  if (p.title_en !== undefined) mapped.name_en = p.title_en
  if (p.description_es !== undefined) mapped.description = p.description_es
  if (p.description_en !== undefined) mapped.description_en = p.description_en
  if (p.price !== undefined) mapped.price = p.price
  if (p.currency !== undefined) mapped.currency = p.currency
  if (p.is_active !== undefined) mapped.is_active = p.is_active
  if (p.sort_order !== undefined) mapped.sort_order = p.sort_order
  return mapped
}

export async function fetchPackages(): Promise<SurfPackage[]> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map(mapPackage)
}

export async function createPackage(payload: PackagePayload): Promise<SurfPackage> {
  const dbPayload = {
    ...payloadToDb(payload),
    currency: payload.currency ?? 'USD',
    is_active: payload.is_active ?? true,
    sort_order: payload.sort_order ?? 0,
  }
  const { data, error } = await supabase
    .from('packages')
    .insert(dbPayload)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapPackage(data as Record<string, unknown>)
}

export async function updatePackage(id: string, payload: Partial<PackagePayload>): Promise<SurfPackage> {
  const { data, error } = await supabase
    .from('packages')
    .update(payloadToDb(payload))
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapPackage(data as Record<string, unknown>)
}

export async function deletePackage(id: string): Promise<void> {
  const { error } = await supabase.from('packages').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
