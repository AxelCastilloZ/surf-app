import { useState } from 'react'
import { Plus, Image, Film, LayoutGrid } from 'lucide-react'
import { useGallery } from '../hooks/useGallery'
import { GalleryTable } from '../components/GalleryTable'
import { UploadDialog } from '../components/UploadDialog'
import { PageHeader } from '@/core/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function GalleryPage() {
  const { data: items, isLoading } = useGallery()
  const [showUpload, setShowUpload] = useState(false)

  const totalItems  = items?.length ?? 0
  const totalImages = items?.filter((i) => i.media_type === 'image').length ?? 0
  const totalVideos = items?.filter((i) => i.media_type === 'video').length ?? 0

  return (
    <div>
      <PageHeader
        title="Galería"
        description="Administra imágenes y videos de la galería pública"
        action={
          <Button onClick={() => setShowUpload(true)} size="sm" className="gap-2">
            <Plus size={16} />
            Subir archivo
          </Button>
        }
      />

      {/* Stats rápidas */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
          <LayoutGrid size={18} className="text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-lg font-semibold text-slate-800">{totalItems}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
          <Image size={18} className="text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Imágenes</p>
            <p className="text-lg font-semibold text-slate-800">{totalImages}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
          <Film size={18} className="text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Videos</p>
            <p className="text-lg font-semibold text-slate-800">{totalVideos}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <GalleryTable items={items ?? []} />
      )}

      {showUpload && <UploadDialog onClose={() => setShowUpload(false)} />}
    </div>
  )
}
