import { apiClient } from '@/core/api/client'

export interface SurfPackage {
  id: string
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  price: number
  duration_days: number
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface PackagePayload {
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  price: number
  duration_days: number
  is_active?: boolean
  sort_order?: number
}

export async function fetchPackages(): Promise<SurfPackage[]> {
  const res = await apiClient<{ data: SurfPackage[] }>('/packages')
  return res.data ?? []
}

export async function createPackage(payload: PackagePayload): Promise<SurfPackage> {
  const res = await apiClient<{ data: SurfPackage }>('/packages', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function updatePackage(id: string, payload: Partial<PackagePayload>): Promise<SurfPackage> {
  const res = await apiClient<{ data: SurfPackage }>(`/packages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return res.data
}

export async function deletePackage(id: string): Promise<void> {
  return apiClient<void>(`/packages/${id}`, { method: 'DELETE' })
}
