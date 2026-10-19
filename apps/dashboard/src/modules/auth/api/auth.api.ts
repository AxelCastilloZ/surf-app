import { supabase } from '@/lib/supabase'
import type { DashboardUser } from '@surf-app/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResult {
  user: DashboardUser
  session: { access_token: string }
}

export async function login(payload: LoginPayload): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  })

  if (error || !data.session) {
    throw new Error(error?.message ?? 'Credenciales inválidas')
  }

  const { data: dbUser, error: dbError } = await supabase
    .from('dashboard_users')
    .select('id, email, role, full_name, is_active, created_at')
    .eq('id', data.user.id)
    .single()

  if (dbError || !dbUser) {
    await supabase.auth.signOut()
    throw new Error('Usuario no encontrado en el sistema')
  }

  if (!dbUser.is_active) {
    await supabase.auth.signOut()
    throw new Error('Cuenta desactivada. Contacta al administrador.')
  }

  return {
    user: dbUser as unknown as DashboardUser,
    session: { access_token: data.session.access_token },
  }
}

export async function getMe(): Promise<DashboardUser> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No session')

  const { data: dbUser, error } = await supabase
    .from('dashboard_users')
    .select('id, email, role, full_name, is_active, created_at')
    .eq('id', session.user.id)
    .single()

  if (error || !dbUser) throw new Error('Usuario no encontrado')
  return dbUser as unknown as DashboardUser
}
