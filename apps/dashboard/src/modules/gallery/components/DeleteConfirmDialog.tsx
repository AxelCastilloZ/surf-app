import { useDeleteGalleryItem } from '../hooks/useDeleteGalleryItem'
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
  onClose: () => void
}

export function DeleteConfirmDialog({ id, onClose }: Props) {
  const { mutate, isPending } = useDeleteGalleryItem()

  function handleDelete() {
    mutate(id, { onSuccess: onClose })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar archivo</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. El archivo será eliminado permanentemente
            de la galería y de Supabase Storage.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
