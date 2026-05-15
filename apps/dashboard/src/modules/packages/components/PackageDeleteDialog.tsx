import { useDeletePackage } from '../hooks/useDeletePackage'
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
  title: string
  onClose: () => void
}

export function PackageDeleteDialog({ id, title, onClose }: Props) {
  const { mutate, isPending } = useDeletePackage()

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar paquete</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar <strong>"{title}"</strong>? Esta acción no se puede
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
