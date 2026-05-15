import { useAuthStore } from '@/core/store/authStore'

const BASE_URL = import.meta.env.VITE_API_URL as string

if (!BASE_URL) throw new Error('VITE_API_URL is not defined')

export async function apiClient<T>(path: string, options?: RequestInit): Promise<T> {
  const { token, logout } = useAuthStore.getState()

  const isFormData = options?.body instanceof FormData

  const headers: Record<string, string> = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> | undefined),
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    logout()
    window.location.href = '/login'
    throw new Error('Sesión expirada')
  }

  if (res.status === 204) return undefined as T

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const msg = Array.isArray(body?.message)
      ? body.message.join(', ')
      : (body?.message ?? `Error ${res.status}`)
    throw new Error(msg)
  }

  return res.json() as Promise<T>
}
