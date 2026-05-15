import { useState } from 'react'
import type { GalleryItem, GalleryCategory } from '@surf-app/types'
import { useUpdateGalleryItem } from '../hooks/useUpdateGalleryItem'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: 'lessons',        label: 'Clases de surf' },
  { value: 'trips',          label: 'Surf Trips' },
  { value: 'video_analysis', label: 'Video Análisis' },
  { value: 'general',        label: 'General' },
]

interface Props {
  item: GalleryItem
  onClose: () => void
}

export function EditCategoryDialog({ item, onClose }: Props) {
  const { mutate, isPending } = useUpdateGalleryItem()
  const [category, setCategory] = useState<GalleryCategory>(item.category)
  const [altText, setAltText] = useState(item.alt_text ?? '')
  const [altTextEn, setAltTextEn] = useState(item.alt_text_en ?? '')

  function handleSave() {
    mutate(
      {
        id: item.id,
        payload: {
          category,
          alt_text: altText.trim() || undefined,
          alt_text_en: altTextEn.trim() || undefined,
        },
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar archivo</DialogTitle>
          <DialogDescription>
            Cambia la categoría o las descripciones de texto alternativo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Thumbnail */}
          <div className="flex items-center gap-3">
            <img
              src={item.url}
              alt={item.alt_text ?? ''}
              className="h-16 w-16 rounded-lg object-cover border border-slate-200"
            />
            <div className="text-sm text-slate-500">
              <span className="font-medium text-slate-700 capitalize">{item.media_type}</span>
              {' · '}orden {item.sort_order}
            </div>
          </div>

          {/* Categoría */}
          <div className="space-y-1.5">
            <Label>Categoría</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GalleryCategory)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Alt text ES */}
          <div className="space-y-1.5">
            <Label>Descripción (español)</Label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Ej. Clase de surf en Tamarindo"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Alt text EN */}
          <div className="space-y-1.5">
            <Label>Description (English)</Label>
            <input
              type="text"
              value={altTextEn}
              onChange={(e) => setAltTextEn(e.target.value)}
              placeholder="E.g. Surf lesson in Tamarindo"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
