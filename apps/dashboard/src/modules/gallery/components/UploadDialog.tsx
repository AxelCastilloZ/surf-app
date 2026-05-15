import { useState, useCallback } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { Upload, X, Image, Film, AlertCircle } from 'lucide-react'
import { useUploadFile } from '../hooks/useUploadFile'
import type { GalleryCategory } from '@surf-app/types'
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
import { cn } from '@/lib/utils'

interface Props {
  onClose: () => void
}

const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
}

const IMAGE_MAX = 10 * 1024 * 1024  // 10 MB
const VIDEO_MAX = 50 * 1024 * 1024  // 50 MB

const CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: 'lessons',        label: 'Clases de surf' },
  { value: 'trips',          label: 'Surf Trips' },
  { value: 'video_analysis', label: 'Video Análisis' },
  { value: 'general',        label: 'General' },
]

export function UploadDialog({ onClose }: Props) {
  const { mutate, isPending } = useUploadFile()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [category, setCategory] = useState<GalleryCategory>('general')
  const [altText, setAltText] = useState('')
  const [altTextEn, setAltTextEn] = useState('')
  const [sizeError, setSizeError] = useState<string | null>(null)

  const isVideo = file?.type.startsWith('video/') ?? false

  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    setSizeError(null)
    if (rejected.length > 0) {
      setSizeError('Tipo de archivo no permitido. Usa: JPG, PNG, WEBP, MP4, WEBM')
      return
    }
    const f = accepted[0]
    if (!f) return

    // Validación de tamaño en frontend
    const maxSize = f.type.startsWith('video/') ? VIDEO_MAX : IMAGE_MAX
    if (f.size > maxSize) {
      const limitMB = maxSize / 1024 / 1024
      const fileMB = (f.size / 1024 / 1024).toFixed(1)
      setSizeError(`El archivo (${fileMB} MB) supera el límite permitido (${limitMB} MB)`)
      return
    }

    setFile(f)
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f))
    } else {
      setPreview(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: VIDEO_MAX, // límite real aplicado en frontend
    multiple: false,
  })

  function handleClear() {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setSizeError(null)
  }

  function handleUpload() {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)
    if (altText.trim())   formData.append('alt_text', altText.trim())
    if (altTextEn.trim()) formData.append('alt_text_en', altTextEn.trim())
    mutate(formData, { onSuccess: onClose })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Subir archivo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Dropzone o preview */}
          {!file ? (
            <>
              <div
                {...getRootProps()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors',
                  isDragActive
                    ? 'border-slate-400 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                )}
              >
                <input {...getInputProps()} />
                <Upload size={28} className="mb-3 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">
                  {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra un archivo o haz clic para seleccionar'}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Imágenes: JPG, PNG, WEBP — máx. 10 MB
                </p>
                <p className="text-xs text-slate-400">
                  Videos: MP4, WEBM — máx. 50 MB
                </p>
              </div>
              {sizeError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  <AlertCircle size={15} />
                  {sizeError}
                </div>
              )}
            </>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-slate-200">
              {isVideo ? (
                <div className="flex h-32 items-center justify-center gap-3 bg-slate-50">
                  <Film size={28} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(1)} MB · Video</p>
                  </div>
                </div>
              ) : (
                <img
                  src={preview!}
                  alt="preview"
                  className="h-48 w-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded bg-black/50 px-2 py-1">
                {isVideo ? <Film size={12} className="text-white" /> : <Image size={12} className="text-white" />}
                <span className="text-xs text-white">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
            </div>
          )}

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
            <Label>
              Descripción en español{' '}
              <span className="font-normal text-slate-400">(opcional, mejora SEO)</span>
            </Label>
            <Input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Ej. Clase de surf en Tamarindo"
            />
          </div>

          {/* Alt text EN */}
          <div className="space-y-1.5">
            <Label>
              Description in English{' '}
              <span className="font-normal text-slate-400">(optional)</span>
            </Label>
            <Input
              value={altTextEn}
              onChange={(e) => setAltTextEn(e.target.value)}
              placeholder="E.g. Surf lesson in Tamarindo"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!file || isPending}>
            {isPending ? 'Subiendo...' : `Subir ${isVideo ? 'video' : 'imagen'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
