import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

async function fetchSetting(key: string): Promise<string> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error || !data) throw new Error(`Setting ${key} not found`)
  return data.value
}

export function useSiteSetting(key: string) {
  return useQuery({
    queryKey: ['site-setting', key],
    queryFn: () => fetchSetting(key),
    staleTime: 1000 * 60 * 10,
  })
}
