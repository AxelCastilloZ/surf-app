import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/core/store/authStore'
import type { UserRole } from '@surf-app/types'

interface Props {
  allowedRoles?: UserRole[]
  children?: React.ReactNode
}

export function ProtectedRoute({ allowedRoles, children }: Props) {
  const { token, user } = useAuthStore()

  if (!token || !user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
