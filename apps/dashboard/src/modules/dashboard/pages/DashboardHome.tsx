import { Images, Package, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/core/store/authStore'
import { RoleGate } from '@/core/guards/RoleGate'
import { PageHeader } from '@/core/components/PageHeader'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGallery } from '@/modules/gallery/hooks/useGallery'
import { usePackages } from '@/modules/packages/hooks/usePackages'

interface StatCardProps {
  label: string
  value: number | undefined
  icon: React.ElementType
  to: string
  loading: boolean
}

function StatCard({ label, value, icon: Icon, to, loading }: StatCardProps) {
  return (
    <Link to={to} className="group">
      <Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
        <div className="rounded-lg bg-slate-100 p-3 group-hover:bg-slate-200 transition-colors">
          <Icon size={20} className="text-slate-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-500">{label}</p>
          {loading ? (
            <Skeleton className="mt-1 h-7 w-12" />
          ) : (
            <p className="text-2xl font-semibold text-slate-900">{value ?? 0}</p>
          )}
        </div>
      </Card>
    </Link>
  )
}

export function DashboardHome() {
  const user = useAuthStore((s) => s.user)
  const { data: galleryItems, isLoading: galleryLoading } = useGallery()
  const { data: packages, isLoading: packagesLoading } = usePackages()

  return (
    <div>
      <PageHeader
        title={`Bienvenido, ${user?.full_name?.split(' ')[0] ?? ''}!`}
        description="Resumen general del panel de administración"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Archivos en galería"
          value={galleryItems?.length}
          icon={Images}
          to="/dashboard/gallery"
          loading={galleryLoading}
        />
        <StatCard
          label="Paquetes activos"
          value={packages?.filter((p) => p.is_active).length}
          icon={Package}
          to="/dashboard/packages"
          loading={packagesLoading}
        />
        <RoleGate roles={['superadmin']}>
          <Link to="/dashboard/users" className="group">
            <Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
              <div className="rounded-lg bg-slate-100 p-3 group-hover:bg-slate-200 transition-colors">
                <Users size={20} className="text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Usuarios admin</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">Próximamente</p>
              </div>
            </Card>
          </Link>
        </RoleGate>
      </div>
    </div>
  )
}
