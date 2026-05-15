import type { UserRole } from '@surf-app/types'
import { useAuthStore } from '@/core/store/authStore'

interface Props {
  roles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGate({ roles, children, fallback = null }: Props) {
  const { user } = useAuthStore()
  if (!user || !roles.includes(user.role)) return <>{fallback}</>
  return <>{children}</>
}
