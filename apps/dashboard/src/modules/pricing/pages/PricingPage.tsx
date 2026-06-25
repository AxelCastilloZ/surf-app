import { useState } from 'react'
import { Plus } from 'lucide-react'
import { usePricingTiers } from '../hooks/usePricingTiers'
import { PricingTiersTable } from '../components/PricingTiersTable'
import { PricingTierFormDialog } from '../components/PricingTierFormDialog'
import { PageHeader } from '@/core/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function PricingPage() {
  const { data: tiers, isLoading } = usePricingTiers()
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div>
      <PageHeader
        title="Tarifas"
        description="Configura los precios por tipo de servicio y número de participantes"
        action={
          <Button onClick={() => setShowCreate(true)} size="sm" className="gap-2">
            <Plus size={16} />
            Nueva tarifa
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
        <PricingTiersTable tiers={tiers ?? []} />
      )}

      {showCreate && <PricingTierFormDialog onClose={() => setShowCreate(false)} />}
    </div>
  )
}
