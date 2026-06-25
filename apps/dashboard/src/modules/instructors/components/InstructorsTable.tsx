import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { Instructor } from '../api/instructors.api'
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
import { InstructorFormDialog } from './InstructorFormDialog'
import { InstructorDeleteDialog } from './InstructorDeleteDialog'

interface Props {
  instructors: Instructor[]
}

export function InstructorsTable({ instructors }: Props) {
  const [editInst, setEditInst] = useState<Instructor | null>(null)
  const [deleteInst, setDeleteInst] = useState<Instructor | null>(null)

  return (
    <>
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instructors.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-400">
                  No hay instructores creados todavía.
                </TableCell>
              </TableRow>
            )}
            {instructors.map((inst) => (
              <TableRow key={inst.id}>
                <TableCell>
                  {inst.photo_url ? (
                    <img src={inst.photo_url} alt={inst.full_name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-400">
                      {inst.full_name.charAt(0)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-slate-800">{inst.full_name}</TableCell>
                <TableCell className="text-slate-600">{inst.email}</TableCell>
                <TableCell>
                  <Badge variant={inst.is_active ? 'default' : 'secondary'}>
                    {inst.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditInst(inst)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => setDeleteInst(inst)}
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

      {editInst && <InstructorFormDialog instructor={editInst} onClose={() => setEditInst(null)} />}
      {deleteInst && (
        <InstructorDeleteDialog
          id={deleteInst.id}
          name={deleteInst.full_name}
          onClose={() => setDeleteInst(null)}
        />
      )}
    </>
  )
}
