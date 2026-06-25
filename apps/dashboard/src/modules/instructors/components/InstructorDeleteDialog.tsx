import { useDeleteInstructor } from '../hooks/useDeleteInstructor'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  id: string
  name: string
  onClose: () => void
}

export function InstructorDeleteDialog({ id, name, onClose }: Props) {
  const { mutate, isPending } = useDeleteInstructor()

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar instructor</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar a <strong>"{name}"</strong>? Esta acción no se puede
            deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => mutate(id, { onSuccess: onClose })}
          >
            {isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
