import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/core/components/AppLayout'
import { ProtectedRoute } from '@/core/guards/ProtectedRoute'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { DashboardHome } from '@/modules/dashboard/pages/DashboardHome'
import { GalleryPage } from '@/modules/gallery/pages/GalleryPage'
import { PackagesPage } from '@/modules/packages/pages/PackagesPage'
import { UsersPage } from '@/modules/users/pages/UsersPage'

export function App() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas — ProtectedRoute como layout route via Outlet */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/gallery" element={<GalleryPage />} />
          <Route path="/dashboard/packages" element={<PackagesPage />} />

          {/* Solo superadmin */}
          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      {/* Raíz y 404 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
