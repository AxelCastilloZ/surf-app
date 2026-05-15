import { apiClient } from '@/core/api/client'
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
  return apiClient<DashboardUser[]>('/users')
}

export async function createUser(payload: CreateUserPayload): Promise<DashboardUser> {
  return apiClient<DashboardUser>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<DashboardUser> {
  return apiClient<DashboardUser>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
