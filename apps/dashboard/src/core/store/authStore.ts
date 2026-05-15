import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DashboardUser } from '@surf-app/types'

interface AuthState {
  user: DashboardUser | null
  token: string | null
  setAuth: (user: DashboardUser, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'surf-dashboard-auth' },
  ),
)
