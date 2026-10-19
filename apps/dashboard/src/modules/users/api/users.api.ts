import { supabase } from '@/lib/supabase'
import type { DashboardUser, UserRole } from '@surf-app/types'

export interface CreateUserPayload {
  email: string
  password: string
  full_name: string
  role: UserRole
}

export interface UpdateUserPayload {
  full_name?: string
  role?: UserRole
  is_active?: boolean
}

export async function fetchUsers(): Promise<DashboardUser[]> {
  const { data, error } = await supabase
    .from('dashboard_users')
    .select('id, email, role, full_name, is_active, created_at')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as DashboardUser[]
}

export async function createUser(payload: CreateUserPayload): Promise<DashboardUser> {
  const { data, error } = await supabase.functions.invoke('admin-create-user', {
    body: payload,
  })

  if (error) throw new Error(error.message)
  if (data?.error) throw new Error(data.error)
  return data.data as DashboardUser
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<DashboardUser> {
  const { data, error } = await supabase
    .from('dashboard_users')
    .update(payload)
    .eq('id', id)
    .select('id, email, role, full_name, is_active, created_at')
    .single()

  if (error) throw new Error(error.message)
  return data as unknown as DashboardUser
}
