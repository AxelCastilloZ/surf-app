import { apiClient } from '@/core/api/client'
import type { AuthResponse, DashboardUser } from '@surf-app/types'

export interface LoginPayload {
  email: string
  password: string
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getMe(): Promise<DashboardUser> {
  return apiClient<DashboardUser>('/auth/me')
}
