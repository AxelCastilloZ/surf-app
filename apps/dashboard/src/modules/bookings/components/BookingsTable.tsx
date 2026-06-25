import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Eye } from 'lucide-react'
import type { AdminBooking } from '../api/bookings.api'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const SERVICE_LABELS: Record<string, string> = {
  surf_lesson: 'Clase de Surf',
  video_analysis: 'Video Análisis',
  surf_trip: 'Surf Trip',
}

interface Props {
  bookings: AdminBooking[]
  onSelect: (booking: AdminBooking) => void
}

export function BookingsTable({ bookings, onSelect }: Props) {
  if (bookings.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-500">No hay reservas.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Servicio</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Hora</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Instructores</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((b) => (
          <TableRow key={b.id} className="cursor-pointer hover:bg-slate-50" onClick={() => onSelect(b)}>
            <TableCell>
              <div>
                <p className="font-medium text-slate-900">{b.client?.full_name}</p>
                <p className="text-xs text-slate-400">{b.client?.email}</p>
              </div>
            </TableCell>
            <TableCell className="text-sm">{SERVICE_LABELS[b.service_type] ?? b.service_type}</TableCell>
            <TableCell className="text-sm">{b.booking_date}</TableCell>
            <TableCell className="text-sm">{b.start_time?.slice(0, 5)}</TableCell>
            <TableCell>
              <Badge variant="secondary" className={STATUS_COLORS[b.status] ?? ''}>
                {b.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">
              {b.instructors?.length > 0
                ? b.instructors.map(i => i.full_name).join(', ')
                : <span className="text-slate-400">Sin asignar</span>
              }
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onSelect(b) }}>
                <Eye size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
