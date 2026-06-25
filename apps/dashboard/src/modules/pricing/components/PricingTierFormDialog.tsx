import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { PricingTier } from '../api/pricing.api'
import { useCreatePricingTier } from '../hooks/useCreatePricingTier'
import { useUpdatePricingTier } from '../hooks/useUpdatePricingTier'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown } from 'lucide-react'

const SERVICE_OPTIONS = [
  { value: 'surf_lesson', label: 'Clase de Surf' },
  { value: 'video_analysis', label: 'Video Análisis' },
  { value: 'surf_trip', label: 'Surf Trip' },
]

const schema = z.object({
  service_type: z.enum(['surf_lesson', 'video_analysis', 'surf_trip'], { required_error: 'Requerido' }),
  min_participants: z.coerce.number().int().min(1, 'Mínimo 1'),
  max_participants: z.coerce.number().int().min(1, 'Mínimo 1'),
  price_per_person: z.coerce.number().positive('Debe ser mayor a 0'),
  is_active: z.boolean(),
}).refine(d => d.max_participants >= d.min_participants, {
  message: 'Máximo debe ser ≥ mínimo',
  path: ['max_participants'],
})

type FormValues = z.infer<typeof schema>

interface Props {
  tier?: PricingTier
  onClose: () => void
}

export function PricingTierFormDialog({ tier, onClose }: Props) {
  const isEdit = !!tier
  const { mutate: create, isPending: creating } = useCreatePricingTier()
  const { mutate: update, isPending: updating } = useUpdatePricingTier()
  const isPending = creating || updating

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: tier
      ? {
          service_type: tier.service_type as FormValues['service_type'],
          min_participants: tier.min_participants,
          max_participants: tier.max_participants,
          price_per_person: tier.price_per_person,
          is_active: tier.is_active,
        }
      : { is_active: true, min_participants: 1, max_participants: 1 },
  })

  function onSubmit(values: FormValues) {
    if (isEdit) {
      update({ id: tier.id, payload: values }, { onSuccess: onClose })
    } else {
      create(values, { onSuccess: onClose })
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar tarifa' : 'Nueva tarifa'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Tipo de servicio</Label>
            <div className="relative">
              <select
                {...register('service_type')}
                disabled={isEdit}
                className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecciona...</option>
                {SERVICE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.service_type && <p className="text-xs text-red-500">{errors.service_type.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Mín. participantes</Label>
              <Input type="number" min={1} {...register('min_participants')} />
              {errors.min_participants && <p className="text-xs text-red-500">{errors.min_participants.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Máx. participantes</Label>
              <Input type="number" min={1} {...register('max_participants')} />
              {errors.max_participants && <p className="text-xs text-red-500">{errors.max_participants.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Precio por persona (USD)</Label>
            <Input type="number" step="0.01" min="0.01" {...register('price_per_person')} />
            {errors.price_per_person && <p className="text-xs text-red-500">{errors.price_per_person.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input id="tier_active" type="checkbox" className="h-4 w-4 rounded" {...register('is_active')} />
            <Label htmlFor="tier_active" className="cursor-pointer">Activa</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear tarifa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
