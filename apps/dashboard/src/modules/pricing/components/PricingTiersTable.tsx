import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { PricingTier } from '../api/pricing.api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PricingTierFormDialog } from './PricingTierFormDialog'
import { PricingTierDeleteDialog } from './PricingTierDeleteDialog'

const SERVICE_LABELS: Record<string, string> = {
  surf_lesson: 'Clase de Surf',
  video_analysis: 'Video Análisis',
  surf_trip: 'Surf Trip',
}

const SERVICE_COLORS: Record<string, string> = {
  surf_lesson: 'bg-blue-100 text-blue-800',
  video_analysis: 'bg-purple-100 text-purple-800',
  surf_trip: 'bg-emerald-100 text-emerald-800',
}

interface Props {
  tiers: PricingTier[]
}

export function PricingTiersTable({ tiers }: Props) {
  const [editTier, setEditTier] = useState<PricingTier | null>(null)
  const [deleteTier, setDeleteTier] = useState<PricingTier | null>(null)

  const grouped = tiers.reduce<Record<string, PricingTier[]>>((acc, t) => {
    ;(acc[t.service_type] ??= []).push(t)
    return acc
  }, {})

  const serviceTypes = Object.keys(grouped).sort()

  return (
    <>
      {tiers.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          No hay tarifas configuradas todavía.
        </p>
      ) : (
        <div className="space-y-6">
          {serviceTypes.map(st => (
            <div key={st}>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary" className={SERVICE_COLORS[st] ?? ''}>
                  {SERVICE_LABELS[st] ?? st}
                </Badge>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participantes</TableHead>
                      <TableHead>Precio/persona</TableHead>
                      <TableHead>Ejemplo total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grouped[st].map(tier => {
                      const exampleParticipants = tier.min_participants === tier.max_participants
                        ? tier.min_participants
                        : tier.max_participants
                      const exampleTotal = Number(tier.price_per_person) * exampleParticipants
                      const rangeLabel = tier.min_participants === tier.max_participants
                        ? `${tier.min_participants}`
                        : `${tier.min_participants} – ${tier.max_participants}`

                      return (
                        <TableRow key={tier.id}>
                          <TableCell className="font-medium text-slate-800">{rangeLabel}</TableCell>
                          <TableCell className="text-slate-600">${Number(tier.price_per_person).toFixed(2)}</TableCell>
                          <TableCell className="text-slate-500 text-xs">
                            {exampleParticipants} pers. = ${exampleTotal.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={tier.is_active ? 'default' : 'secondary'}>
                              {tier.is_active ? 'Activa' : 'Inactiva'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditTier(tier)}>
                                <Pencil size={14} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => setDeleteTier(tier)}>
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      )}

      {editTier && <PricingTierFormDialog tier={editTier} onClose={() => setEditTier(null)} />}
      {deleteTier && (
        <PricingTierDeleteDialog
          id={deleteTier.id}
          label={`${SERVICE_LABELS[deleteTier.service_type] ?? deleteTier.service_type} (${deleteTier.min_participants}-${deleteTier.max_participants})`}
          onClose={() => setDeleteTier(null)}
        />
      )}
    </>
  )
}
