import { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useBookingDetail } from '../hooks/useBookingDetail'
import { useUpdateBookingStatus, useAssignInstructors } from '../hooks/useBookingMutations'
import { useInstructors } from '../hooks/useInstructors'
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
  bookingId: string
  onClose: () => void
}

export function BookingDetailDialog({ bookingId, onClose }: Props) {
  const { data: booking, isLoading } = useBookingDetail(bookingId)
  const { data: allInstructors } = useInstructors()
  const statusMutation = useUpdateBookingStatus()
  const assignMutation = useAssignInstructors()

  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([])
  const [instructorsInitialized, setInstructorsInitialized] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [showCancelForm, setShowCancelForm] = useState(false)

  if (booking && !instructorsInitialized) {
    setSelectedInstructors(booking.instructors?.map(i => i.id) ?? [])
    setInstructorsInitialized(true)
  }

  function toggleInstructor(id: string) {
    setSelectedInstructors(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function handleAssign() {
    assignMutation.mutate({ id: bookingId, instructorIds: selectedInstructors })
  }

  function handleStatus(status: string) {
    if (status === 'cancelled' && !cancelReason.trim()) {
      setShowCancelForm(true)
      return
    }
    statusMutation.mutate({
      id: bookingId,
      payload: {
        status,
        ...(status === 'cancelled' && cancelReason ? { cancelled_reason: cancelReason } : {}),
      },
    })
    setShowCancelForm(false)
    setCancelReason('')
  }

  const canChangeStatus = booking && !['cancelled', 'completed'].includes(booking.status)
  const assignedIds = new Set(booking?.instructors?.map(i => i.id) ?? [])
  const hasChanges = (() => {
    const selectedSet = new Set(selectedInstructors)
    if (selectedSet.size !== assignedIds.size) return true
    for (const id of selectedSet) if (!assignedIds.has(id)) return true
    return false
  })()

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle de Reserva</DialogTitle>
        </DialogHeader>

        {isLoading || !booking ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status + ID */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className={`text-sm ${STATUS_COLORS[booking.status] ?? ''}`}>
                {booking.status}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">{booking.id.slice(0, 8)}</span>
            </div>

            {/* Client info */}
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Cliente</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <div><span className="text-slate-500">Nombre:</span> {booking.client?.full_name}</div>
                <div><span className="text-slate-500">Email:</span> {booking.client?.email}</div>
                {booking.client?.phone && <div><span className="text-slate-500">Teléfono:</span> {booking.client.phone}</div>}
                {booking.client?.country && <div><span className="text-slate-500">País:</span> {booking.client.country}</div>}
              </div>
            </section>

            <Separator />

            {/* Booking info */}
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Reserva</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <div><span className="text-slate-500">Servicio:</span> {SERVICE_LABELS[booking.service_type] ?? booking.service_type}</div>
                <div><span className="text-slate-500">Fecha:</span> {booking.booking_date}</div>
                <div><span className="text-slate-500">Hora:</span> {booking.start_time?.slice(0, 5)}</div>
                <div><span className="text-slate-500">Participantes:</span> {booking.participants}</div>
                <div><span className="text-slate-500">Precio:</span> {booking.currency} {booking.total_price}</div>
                <div><span className="text-slate-500">Creada:</span> {new Date(booking.created_at).toLocaleDateString()}</div>
              </div>
            </section>

            {/* Medical notes */}
            {booking.medical_notes && (
              <>
                <Separator />
                <section>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Condición médica</h3>
                  <p className="text-sm text-slate-600 rounded-lg bg-amber-50 border border-amber-200 p-3">{booking.medical_notes}</p>
                </section>
              </>
            )}

            {/* Notes */}
            {booking.notes && (
              <section>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">Notas del cliente</h3>
                <p className="text-sm text-slate-600">{booking.notes}</p>
              </section>
            )}

            {booking.internal_notes && (
              <section>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">Notas internas</h3>
                <p className="text-sm text-slate-500 italic">{booking.internal_notes}</p>
              </section>
            )}

            {booking.cancelled_reason && (
              <section>
                <h3 className="text-sm font-semibold text-red-600 mb-1">Motivo de cancelación</h3>
                <p className="text-sm text-red-500">{booking.cancelled_reason}</p>
              </section>
            )}

            <Separator />

            {/* Instructor assignment */}
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Asignar instructores</h3>
              {allInstructors && allInstructors.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {allInstructors.map(inst => {
                      const selected = selectedInstructors.includes(inst.id)
                      return (
                        <button
                          key={inst.id}
                          type="button"
                          onClick={() => toggleInstructor(inst.id)}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                            selected
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          } ${!inst.is_active ? 'opacity-50' : ''}`}
                        >
                          {inst.full_name}
                          {!inst.is_active && ' (inactivo)'}
                        </button>
                      )
                    })}
                  </div>
                  <Button
                    size="sm"
                    disabled={!hasChanges || assignMutation.isPending}
                    onClick={handleAssign}
                  >
                    {assignMutation.isPending ? 'Guardando...' : 'Guardar asignación'}
                  </Button>
                  {assignMutation.isSuccess && (
                    <p className="text-xs text-green-600">Instructores actualizados</p>
                  )}
                  {assignMutation.isError && (
                    <p className="text-xs text-red-500">{(assignMutation.error as Error).message}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No hay instructores registrados</p>
              )}
            </section>

            <Separator />

            {/* Status actions */}
            {canChangeStatus && (
              <section>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Cambiar estado</h3>
                <div className="flex flex-wrap gap-2">
                  {booking.status === 'pending' && (
                    <Button size="sm" onClick={() => handleStatus('confirmed')}>
                      Confirmar
                    </Button>
                  )}
                  {['pending', 'confirmed'].includes(booking.status) && (
                    <Button size="sm" variant="secondary" onClick={() => handleStatus('completed')}>
                      Completar
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleStatus('cancelled')}>
                    Cancelar
                  </Button>
                </div>

                {showCancelForm && (
                  <div className="mt-3 space-y-2">
                    <Label>Motivo de cancelación</Label>
                    <Textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Indica el motivo..."
                      rows={2}
                    />
                    <Button size="sm" variant="destructive" onClick={() => handleStatus('cancelled')}>
                      Confirmar cancelación
                    </Button>
                  </div>
                )}

                {statusMutation.isPending && <p className="mt-2 text-xs text-slate-500">Actualizando...</p>}
                {statusMutation.isError && (
                  <p className="mt-2 text-xs text-red-500">{(statusMutation.error as Error).message}</p>
                )}
              </section>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
