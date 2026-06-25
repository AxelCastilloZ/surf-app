import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, Check } from 'lucide-react'
import { fetchSetting, uploadHeroImage, updateSetting } from '../api/settings.api'
import { PageHeader } from '@/core/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

const POSITION_OPTIONS = [
  { value: 'top', label: 'Arriba' },
  { value: 'center', label: 'Centro' },
  { value: 'bottom', label: 'Abajo' },
] as const

type Position = typeof POSITION_OPTIONS[number]['value']

export function SettingsPage() {
  const qc = useQueryClient()

  const { data: heroSetting, isLoading: isLoadingUrl } = useQuery({
    queryKey: ['site-setting', 'hero_image_url'],
    queryFn: () => fetchSetting('hero_image_url'),
  })

  const { data: posSetting, isLoading: isLoadingPos } = useQuery({
    queryKey: ['site-setting', 'hero_image_position'],
    queryFn: () => fetchSetting('hero_image_position').catch(() => ({ key: 'hero_image_position', value: 'center', updated_at: '' })),
  })

  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [selectedPos, setSelectedPos] = useState<Position | null>(null)

  const savedPos = (posSetting?.value ?? 'center') as Position
  const activePos = selectedPos ?? savedPos
  const posChanged = selectedPos !== null && selectedPos !== savedPos

  const uploadMut = useMutation({
    mutationFn: (f: File) => uploadHeroImage(f),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['site-setting', 'hero_image_url'] })
      setFile(null)
      setFilePreview(null)
    },
  })

  const posMut = useMutation({
    mutationFn: (pos: string) => updateSetting('hero_image_position', pos),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['site-setting', 'hero_image_position'] })
      setSelectedPos(null)
    },
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setFilePreview(URL.createObjectURL(f))
  }

  const currentUrl = filePreview ?? heroSetting?.value
  const isLoading = isLoadingUrl || isLoadingPos

  return (
    <div>
      <PageHeader
        title="Configuración"
        description="Ajustes generales del sitio web"
      />

      <div className="max-w-2xl space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-semibold">Imagen del Hero (portada)</Label>
          <p className="text-sm text-slate-500">
            Esta imagen se muestra como fondo en la sección principal del sitio web.
          </p>

          {isLoading ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : (
            <>
              {/* Preview with dynamic position */}
              {currentUrl && (
                <div className="relative overflow-hidden rounded-lg border border-slate-200">
                  <img
                    src={currentUrl}
                    alt="Hero preview"
                    className="h-48 w-full object-cover transition-all duration-300"
                    style={{ objectPosition: `center ${activePos}` }}
                  />
                  {filePreview && (
                    <span className="absolute top-2 right-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Vista previa
                    </span>
                  )}
                </div>
              )}

              {/* Upload */}
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                  <Upload size={16} />
                  Elegir imagen
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                </label>

                {file && (
                  <Button
                    size="sm"
                    disabled={uploadMut.isPending}
                    onClick={() => uploadMut.mutate(file)}
                  >
                    {uploadMut.isPending ? 'Subiendo...' : 'Subir imagen'}
                  </Button>
                )}
              </div>

              <p className="text-xs text-slate-400">JPG, PNG o WEBP. Máx 10 MB. Recomendado: 1600×900 px o superior.</p>

              {uploadMut.isSuccess && <p className="text-xs text-green-600">Imagen actualizada correctamente</p>}
              {uploadMut.isError && <p className="text-xs text-red-500">{(uploadMut.error as Error).message}</p>}

              {/* Position selector */}
              <div className="space-y-2 pt-2">
                <Label className="text-sm font-medium">Encuadre vertical</Label>
                <p className="text-xs text-slate-400">
                  Elige qué parte de la imagen se prioriza al recortarla en distintos tamaños de pantalla.
                </p>
                <div className="flex gap-2">
                  {POSITION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedPos(opt.value)}
                      className={`flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium transition ${
                        activePos === opt.value
                          ? 'border-ocean-500 bg-ocean-50 text-ocean-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {activePos === opt.value && <Check size={14} />}
                      {opt.label}
                    </button>
                  ))}
                </div>

                {posChanged && (
                  <Button
                    size="sm"
                    disabled={posMut.isPending}
                    onClick={() => posMut.mutate(selectedPos!)}
                  >
                    {posMut.isPending ? 'Guardando...' : 'Guardar encuadre'}
                  </Button>
                )}

                {posMut.isSuccess && <p className="text-xs text-green-600">Encuadre actualizado</p>}
                {posMut.isError && <p className="text-xs text-red-500">{(posMut.error as Error).message}</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
