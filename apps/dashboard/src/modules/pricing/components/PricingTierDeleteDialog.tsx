import { useDeletePricingTier } from '../hooks/useDeletePricingTier'
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
  label: string
  onClose: () => void
}

export function PricingTierDeleteDialog({ id, label, onClose }: Props) {
  const { mutate, isPending } = useDeletePricingTier()

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar tarifa</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar la tarifa <strong>"{label}"</strong>? Esta acción no se puede
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
