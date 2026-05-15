import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { Pencil, Trash2, Eye, EyeOff, Image, Film } from 'lucide-react'
import type { GalleryItem, GalleryCategory } from '@surf-app/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUpdateGalleryItem } from '../hooks/useUpdateGalleryItem'
import { EditCategoryDialog } from './EditCategoryDialog'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

const CATEGORY_STYLES: Record<GalleryCategory, string> = {
  lessons:        'bg-teal-400/20 text-teal-300 border border-teal-600',
  trips:          'bg-sand-500/20 text-sand-400 border border-sand-600',
  video_analysis: 'bg-jungle-400/20 text-jungle-300 border border-jungle-600',
  general:        'bg-slate-700/40 text-slate-400 border border-slate-600',
}

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  lessons:        'Clases',
  trips:          'Trips',
  video_analysis: 'Video Análisis',
  general:        'General',
}

interface Props {
  items: GalleryItem[]
}

export function GalleryTable({ items }: Props) {
  const [editItem, setEditItem] = useState<GalleryItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { mutate: updateItem, isPending: isUpdating } = useUpdateGalleryItem()

  function toggleVisible(item: GalleryItem) {
    updateItem({ id: item.id, payload: { is_visible: !item.is_visible } })
  }

  const columns: ColumnDef<GalleryItem>[] = [
    {
      id: 'thumbnail',
      header: 'Archivo',
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            <img
              src={item.url}
              alt={item.alt_text ?? ''}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {item.media_type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Film size={16} className="text-white" />
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: 'media_type',
      header: 'Tipo',
      cell: ({ row }) => {
        const isVideo = row.original.media_type === 'video'
        return (
          <Badge variant="outline" className="gap-1.5 text-xs">
            {isVideo ? <Film size={11} /> : <Image size={11} />}
            {isVideo ? 'Video' : 'Imagen'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'category',
      header: 'Categoría',
      cell: ({ row }) => {
        const cat = row.original.category as GalleryCategory
        return (
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_STYLES[cat] ?? ''}`}>
            {CATEGORY_LABELS[cat] ?? cat}
          </span>
        )
      },
    },
    {
      accessorKey: 'is_visible',
      header: 'Visible',
      cell: ({ row }) => {
        const item = row.original
        return (
          <button
            onClick={() => toggleVisible(item)}
            disabled={isUpdating}
            title={item.is_visible ? 'Ocultar' : 'Mostrar'}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              item.is_visible
                ? 'bg-teal-400/20 text-teal-300 hover:bg-teal-400/30'
                : 'bg-slate-700/40 text-slate-400 hover:bg-slate-700/60'
            }`}
          >
            {item.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
            {item.is_visible ? 'Sí' : 'No'}
          </button>
        )
      },
    },
    {
      accessorKey: 'sort_order',
      header: 'Orden',
      cell: ({ row }) => {
        const item = row.original
        return (
          <input
            type="number"
            defaultValue={item.sort_order}
            min={0}
            className="w-16 rounded border border-slate-200 px-2 py-1 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
            onBlur={(e) => {
              const val = parseInt(e.target.value, 10)
              if (!isNaN(val) && val !== item.sort_order) {
                updateItem({ id: item.id, payload: { sort_order: val } })
              }
            }}
          />
        )
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Editar categoría"
            onClick={() => setEditItem(row.original)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600"
            title="Eliminar"
            onClick={() => setDeleteId(row.original.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <>
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-10 text-center text-sm text-slate-400">
                  No hay archivos en la galería todavía.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {table.getPageCount() > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            {' '}· {items.length} items totales
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {editItem && (
        <EditCategoryDialog item={editItem} onClose={() => setEditItem(null)} />
      )}
      {deleteId && (
        <DeleteConfirmDialog id={deleteId} onClose={() => setDeleteId(null)} />
      )}
    </>
  )
}
