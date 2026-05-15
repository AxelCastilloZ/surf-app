import { useState } from 'react'
import { Pencil } from 'lucide-react'
import type { DashboardUser } from '@surf-app/types'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { UserFormDialog } from './UserFormDialog'

interface Props {
  users: DashboardUser[]
  currentUserId: string
}

export function UsersTable({ users, currentUserId }: Props) {
  const [editUser, setEditUser] = useState<DashboardUser | null>(null)

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-400">
                  No hay usuarios registrados.
                </TableCell>
              </TableRow>
            )}
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
                        {getInitials(u.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {u.full_name}
                        {u.id === currentUserId && (
                          <span className="ml-1.5 text-xs text-slate-400">(tú)</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={u.role === 'superadmin' ? 'default' : 'secondary'} className="capitalize">
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={u.is_active ? 'default' : 'destructive'}>
                    {u.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-500">
                  {new Date(u.created_at).toLocaleDateString('es-CR')}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditUser(u)}
                  >
                    <Pencil size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editUser && <UserFormDialog user={editUser} onClose={() => setEditUser(null)} />}
    </>
  )
}
