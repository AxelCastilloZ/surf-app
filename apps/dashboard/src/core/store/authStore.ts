import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DashboardUser } from '@surf-app/types'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: DashboardUser | null
  session: { access_token: string } | null
  setAuth: (user: DashboardUser, session: { access_token: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      setAuth: (user, session) => set({ user, session }),
      logout: () => {
        supabase.auth.signOut()
        set({ user: null, session: null })
      },
    }),
    { name: 'surf-dashboard-auth' },
  ),
)

supabase.auth.onAuthStateChange((_event, session) => {
  if (!session) {
    useAuthStore.setState({ user: null, session: null })
  }
})
