import { createServiceClient, createAnonClient } from '../_shared/supabase.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  const corsRes = handleCors(req)
  if (corsRes) return corsRes

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const anonClient = createAnonClient(authHeader)

    const { data: { user }, error: authError } = await anonClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { id, instructor_ids } = await req.json()

    if (!id || !Array.isArray(instructor_ids)) {
      return new Response(
        JSON.stringify({ error: 'id y instructor_ids son requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabase = createServiceClient()

    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Reserva no encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Remove existing instructor assignments
    await supabase
      .from('booking_instructors')
      .delete()
      .eq('booking_id', id)

    if (instructor_ids.length > 0) {
      // Verify all instructors exist
      const { data: instructors } = await supabase
        .from('instructors')
        .select('id')
        .in('id', instructor_ids)

      const foundIds = new Set((instructors ?? []).map((i: { id: string }) => i.id))
      const missing = instructor_ids.filter((iid: string) => !foundIds.has(iid))

      if (missing.length > 0) {
        return new Response(
          JSON.stringify({ error: `Instructor(es) no encontrado(s): ${missing.join(', ')}` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }

      // Insert new assignments
      const rows = instructor_ids.map((instructor_id: string) => ({
        booking_id: id,
        instructor_id,
      }))

      const { error: insertError } = await supabase
        .from('booking_instructors')
        .insert(rows)

      if (insertError) {
        return new Response(
          JSON.stringify({ error: `Error al asignar: ${insertError.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    // Re-fetch full booking
    const { data: updated } = await supabase
      .from('bookings')
      .select(`
        id, service_type, booking_date, start_time, end_time,
        participants, status, total_price, currency,
        medical_notes, notes, internal_notes, cancelled_reason,
        confirmed_at, created_at, updated_at,
        clients (id, full_name, email, phone, country, language),
        packages (id, name, name_en, price, currency),
        booking_instructors (instructors (id, full_name, email, is_active))
      `)
      .eq('id', id)
      .single()

    return new Response(
      JSON.stringify({
        data: updated ? mapBooking(updated) : { id },
        message: instructor_ids.length === 0
          ? 'Instructores removidos de la reserva'
          : 'Instructores asignados correctamente',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('assign-instructors error:', err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})

// deno-lint-ignore no-explicit-any
function mapBooking(row: any) {
  return {
    id: row.id,
    client: row.clients,
    package: row.packages,
    instructors: (row.booking_instructors ?? []).map((bi: { instructors: unknown }) => bi.instructors),
    service_type: row.service_type,
    booking_date: row.booking_date,
    start_time: row.start_time,
    end_time: row.end_time,
    participants: row.participants,
    status: row.status,
    total_price: row.total_price,
    currency: row.currency,
    medical_notes: row.medical_notes,
    notes: row.notes,
    internal_notes: row.internal_notes,
    cancelled_reason: row.cancelled_reason,
    confirmed_at: row.confirmed_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}
