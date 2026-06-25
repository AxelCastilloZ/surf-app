import { apiClient } from '@/core/api/client'

export interface SiteSetting {
  key: string
  value: string
  updated_at: string
}

export async function fetchSetting(key: string): Promise<SiteSetting> {
  const res = await apiClient<{ data: SiteSetting }>(`/site-settings/${key}`)
  return res.data
}

export async function updateSetting(key: string, value: string): Promise<SiteSetting> {
  const res = await apiClient<{ data: SiteSetting }>(`/site-settings/${key}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  })
  return res.data
}

export async function uploadHeroImage(file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiClient<{ data: { url: string } }>('/site-settings/hero-image', {
    method: 'POST',
    body: formData,
  })
  return res.data
}
