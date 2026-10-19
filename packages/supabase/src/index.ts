import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type { SupabaseClient } from '@supabase/supabase-js'

export function createSupabaseClient(url: string, anonKey: string): SupabaseClient {
  return createClient(url, anonKey, {
    auth: { persistSession: true },
  })
}

export function createSupabaseServerClient(url: string, serviceRoleKey: string): SupabaseClient {
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
