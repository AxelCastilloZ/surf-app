import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { SurfPackage } from '../api/packages.api'
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
import { PackageFormDialog } from './PackageFormDialog'
import { PackageDeleteDialog } from './PackageDeleteDialog'

interface Props {
  packages: SurfPackage[]
}

export function PackagesTable({ packages }: Props) {
  const [editPkg, setEditPkg] = useState<SurfPackage | null>(null)
  const [deletePkg, setDeletePkg] = useState<SurfPackage | null>(null)

  return (
    <>
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-400">
                  No hay paquetes creados todavía.
                </TableCell>
              </TableRow>
            )}
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium text-slate-800">{pkg.title_es}</TableCell>
                <TableCell className="text-slate-600">${pkg.price.toFixed(2)}</TableCell>
                <TableCell className="text-slate-600">{pkg.duration_days} día{pkg.duration_days !== 1 ? 's' : ''}</TableCell>
                <TableCell>
                  <Badge variant={pkg.is_active ? 'default' : 'secondary'}>
                    {pkg.is_active ? 'Activo' : 'Oculto'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditPkg(pkg)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => setDeletePkg(pkg)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editPkg && <PackageFormDialog package={editPkg} onClose={() => setEditPkg(null)} />}
      {deletePkg && (
        <PackageDeleteDialog
          id={deletePkg.id}
          title={deletePkg.title_es}
          onClose={() => setDeletePkg(null)}
        />
      )}
    </>
  )
}
