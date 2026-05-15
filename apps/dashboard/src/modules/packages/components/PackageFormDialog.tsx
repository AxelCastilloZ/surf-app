import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { SurfPackage } from '../api/packages.api'
import { useCreatePackage } from '../hooks/useCreatePackage'
import { useUpdatePackage } from '../hooks/useUpdatePackage'
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
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const schema = z.object({
  title_es: z.string().min(1, 'Requerido'),
  title_en: z.string().min(1, 'Required'),
  description_es: z.string().min(1, 'Requerido'),
  description_en: z.string().min(1, 'Required'),
  price: z.coerce.number().positive('Debe ser mayor a 0'),
  duration_days: z.coerce.number().int().positive('Debe ser mayor a 0'),
  is_active: z.boolean(),
  sort_order: z.coerce.number().int().min(0),
})

type FormValues = z.infer<typeof schema>

interface Props {
  package?: SurfPackage
  onClose: () => void
}

export function PackageFormDialog({ package: pkg, onClose }: Props) {
  const isEdit = !!pkg
  const { mutate: create, isPending: creating } = useCreatePackage()
  const { mutate: update, isPending: updating } = useUpdatePackage()
  const isPending = creating || updating

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: pkg
      ? {
          title_es: pkg.title_es,
          title_en: pkg.title_en,
          description_es: pkg.description_es,
          description_en: pkg.description_en,
          price: pkg.price,
          duration_days: pkg.duration_days,
          is_active: pkg.is_active,
          sort_order: pkg.sort_order,
        }
      : { is_active: true, sort_order: 0 },
  })

  function onSubmit(values: FormValues) {
    if (isEdit) {
      update({ id: pkg.id, payload: values }, { onSuccess: onClose })
    } else {
      create(values, { onSuccess: onClose })
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar paquete' : 'Nuevo paquete'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <Tabs defaultValue="es">
            <TabsList className="mb-4">
              <TabsTrigger value="es">Español</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>

            <TabsContent value="es" className="space-y-3">
              <div className="space-y-1.5">
                <Label>Título (ES)</Label>
                <Input {...register('title_es')} placeholder="Ej. Clases de surf para principiantes" />
                {errors.title_es && <p className="text-xs text-red-500">{errors.title_es.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Descripción (ES)</Label>
                <Textarea rows={4} {...register('description_es')} placeholder="Descripción del paquete..." />
                {errors.description_es && <p className="text-xs text-red-500">{errors.description_es.message}</p>}
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-3">
              <div className="space-y-1.5">
                <Label>Title (EN)</Label>
                <Input {...register('title_en')} placeholder="E.g. Beginner surf lessons" />
                {errors.title_en && <p className="text-xs text-red-500">{errors.title_en.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Description (EN)</Label>
                <Textarea rows={4} {...register('description_en')} placeholder="Package description..." />
                {errors.description_en && <p className="text-xs text-red-500">{errors.description_en.message}</p>}
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Precio (USD)</Label>
              <Input type="number" step="0.01" min="0" {...register('price')} />
              {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Duración (días)</Label>
              <Input type="number" min="1" {...register('duration_days')} />
              {errors.duration_days && <p className="text-xs text-red-500">{errors.duration_days.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Orden</Label>
              <Input type="number" min="0" {...register('sort_order')} />
            </div>
            <div className="flex items-end pb-1">
              <div className="flex items-center gap-2">
                <input id="pkg_active" type="checkbox" className="h-4 w-4 rounded" {...register('is_active')} />
                <Label htmlFor="pkg_active" className="cursor-pointer">Visible al público</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear paquete'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
