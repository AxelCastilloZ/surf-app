import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { DashboardUser } from '@surf-app/types'
import { useCreateUser } from '../hooks/useCreateUser'
import { useUpdateUser } from '../hooks/useUpdateUser'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const createSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  full_name: z.string().min(1, 'Requerido'),
  role: z.enum(['superadmin', 'admin']),
})

const editSchema = z.object({
  full_name: z.string().min(1, 'Requerido'),
  role: z.enum(['superadmin', 'admin']),
  is_active: z.boolean(),
})

type CreateValues = z.infer<typeof createSchema>
type EditValues = z.infer<typeof editSchema>

interface CreateProps {
  user?: undefined
  onClose: () => void
}

interface EditProps {
  user: DashboardUser
  onClose: () => void
}

type Props = CreateProps | EditProps

export function UserFormDialog({ user, onClose }: Props) {
  const isEdit = !!user
  const { mutate: create, isPending: creating } = useCreateUser()
  const { mutate: update, isPending: updating } = useUpdateUser()
  const isPending = creating || updating

  // Create form
  const createForm = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { role: 'admin' },
  })

  // Edit form
  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: isEdit
      ? { full_name: user.full_name, role: user.role, is_active: user.is_active }
      : undefined,
  })

  function onCreateSubmit(values: CreateValues) {
    create(values, { onSuccess: onClose })
  }

  function onEditSubmit(values: EditValues) {
    if (!user) return
    update({ id: user.id, payload: values }, { onSuccess: onClose })
  }

  if (isEdit) {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = editForm
    const role = watch('role')
    const isActive = watch('is_active')

    return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nombre completo</Label>
              <Input {...register('full_name')} />
              {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Rol</Label>
              <Select value={role} onValueChange={(v) => setValue('role', v as 'superadmin' | 'admin')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="is_active"
                type="checkbox"
                className="h-4 w-4 rounded"
                checked={isActive}
                onChange={(e) => setValue('is_active', e.target.checked)}
              />
              <Label htmlFor="is_active" className="cursor-pointer">Usuario activo</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  const { register, handleSubmit, setValue, watch, formState: { errors } } = createForm
  const role = watch('role')

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Nombre completo</Label>
            <Input {...register('full_name')} placeholder="Nombre Apellido" />
            {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Correo electrónico</Label>
            <Input type="email" {...register('email')} placeholder="user@ejemplo.com" />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Contraseña</Label>
            <Input type="password" {...register('password')} placeholder="Mínimo 8 caracteres" />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Rol</Label>
            <Select value={role} onValueChange={(v) => setValue('role', v as 'superadmin' | 'admin')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Superadmin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creando...' : 'Crear usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
