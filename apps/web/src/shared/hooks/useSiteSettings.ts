import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL as string

async function fetchSetting(key: string): Promise<string> {
  const res = await fetch(`${API_URL}/site-settings/${key}`)
  if (!res.ok) throw new Error(`Setting ${key} not found`)
  const json = await res.json()
  return json.data?.value ?? json.value
}

export function useSiteSetting(key: string) {
  return useQuery({
    queryKey: ['site-setting', key],
    queryFn: () => fetchSetting(key),
    staleTime: 1000 * 60 * 10,
  })
}
