import { useState } from 'react'
import { Plus } from 'lucide-react'
import { usePackages } from '../hooks/usePackages'
import { PackagesTable } from '../components/PackagesTable'
import { PackageFormDialog } from '../components/PackageFormDialog'
import { PageHeader } from '@/core/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function PackagesPage() {
  const { data: packages, isLoading } = usePackages()
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div>
      <PageHeader
        title="Paquetes"
        description="Administra los paquetes de surf disponibles"
        action={
          <Button onClick={() => setShowCreate(true)} size="sm" className="gap-2">
            <Plus size={16} />
            Nuevo paquete
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <PackagesTable packages={packages ?? []} />
      )}

      {showCreate && <PackageFormDialog onClose={() => setShowCreate(false)} />}
    </div>
  )
}
