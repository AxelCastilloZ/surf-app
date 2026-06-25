import { useState } from 'react'
import { PageHeader } from '@/core/components/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { useBookings } from '../hooks/useBookings'
import { BookingsTable } from '../components/BookingsTable'
import { BookingDetailDialog } from '../components/BookingDetailDialog'
import type { AdminBooking } from '../api/bookings.api'

const STATUS_FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'completed', label: 'Completadas' },
  { value: 'cancelled', label: 'Canceladas' },
]

export function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null)
  const { data: bookings, isLoading } = useBookings(statusFilter || undefined)

  return (
    <div className="p-6">
      <PageHeader
        title="Reservas"
        description="Gestiona las reservas y asigna instructores."
      />

      {/* Status filter tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              statusFilter === f.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <BookingsTable
          bookings={bookings ?? []}
          onSelect={setSelectedBooking}
        />
      )}

      {selectedBooking && (
        <BookingDetailDialog
          bookingId={selectedBooking.id}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  )
}
