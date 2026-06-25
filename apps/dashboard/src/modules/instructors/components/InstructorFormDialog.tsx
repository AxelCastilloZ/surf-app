import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload } from 'lucide-react'
import type { Instructor } from '../api/instructors.api'
import { uploadInstructorPhoto } from '../api/instructors.api'
import { useCreateInstructor } from '../hooks/useCreateInstructor'
import { useUpdateInstructor } from '../hooks/useUpdateInstructor'
import { INSTRUCTORS_KEY } from '../hooks/useInstructors'
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

const schema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  bio: z.string().optional().or(z.literal('')),
  google_calendar_id: z.string().optional().or(z.literal('')),
  is_active: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  instructor?: Instructor
  onClose: () => void
}

export function InstructorFormDialog({ instructor, onClose }: Props) {
  const isEdit = !!instructor
  const { mutate: create, isPending: creating } = useCreateInstructor()
  const { mutate: update, isPending: updating } = useUpdateInstructor()
  const isPending = creating || updating

  const qc = useQueryClient()
  const photoMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => uploadInstructorPhoto(id, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: INSTRUCTORS_KEY }),
  })

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(instructor?.photo_url ?? null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: instructor
      ? {
          full_name: instructor.full_name,
          email: instructor.email,
          bio: instructor.bio ?? '',
          google_calendar_id: instructor.google_calendar_id ?? '',
          is_active: instructor.is_active,
        }
      : { is_active: true, bio: '', google_calendar_id: '' },
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function onSubmit(values: FormValues) {
    const payload = {
      ...values,
      bio: values.bio || undefined,
      google_calendar_id: values.google_calendar_id || undefined,
    }

    if (isEdit) {
      update({ id: instructor.id, payload }, {
        onSuccess: () => {
          if (photoFile) {
            photoMutation.mutate({ id: instructor.id, file: photoFile }, { onSuccess: onClose })
          } else {
            onClose()
          }
        },
      })
    } else {
      create(payload, {
        onSuccess: (created) => {
          if (photoFile) {
            photoMutation.mutate({ id: created.id, file: photoFile }, { onSuccess: onClose })
          } else {
            onClose()
          }
        },
      })
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar instructor' : 'Nuevo instructor'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Photo */}
          <div className="space-y-1.5">
            <Label>Foto</Label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="h-16 w-16 rounded-full object-cover border border-slate-200" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Upload size={20} />
                </div>
              )}
              <div>
                <label className="cursor-pointer rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                  Elegir foto
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                </label>
                <p className="mt-1 text-xs text-slate-400">JPG, PNG o WEBP. Máx 10 MB.</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Nombre completo</Label>
            <Input {...register('full_name')} placeholder="Ej. Carlos Rodríguez" />
            {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" {...register('email')} placeholder="carlos@ejemplo.com" />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Biografía</Label>
            <Textarea {...register('bio')} placeholder="Breve descripción del instructor..." rows={3} />
          </div>

          <div className="space-y-1.5">
            <Label>Google Calendar ID</Label>
            <Input {...register('google_calendar_id')} placeholder="ejemplo@group.calendar.google.com" />
            <p className="text-xs text-slate-400">
              Se usará cuando integremos disponibilidad automática. Puedes dejarlo vacío por ahora.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input id="inst_active" type="checkbox" className="h-4 w-4 rounded" {...register('is_active')} />
            <Label htmlFor="inst_active" className="cursor-pointer">Activo</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending || photoMutation.isPending}>
              {isPending || photoMutation.isPending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear instructor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
