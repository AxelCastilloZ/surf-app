import { createServiceClient, createAnonClient } from '../_shared/supabase.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { sendEmail, getWebUrl } from '../_shared/resend.ts'

const SERVICE_LABELS_ES: Record<string, string> = {
  surf_lesson: 'Clase de Surf',
  video_analysis: 'Video Análisis',
  surf_trip: 'Surf Trip',
}

const SERVICE_LABELS_EN: Record<string, string> = {
  surf_lesson: 'Surf Lesson',
  video_analysis: 'Video Analysis',
  surf_trip: 'Surf Trip',
}

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

    const { id, status, internal_notes, cancelled_reason } = await req.json()

    if (!id || !status) {
      return new Response(
        JSON.stringify({ error: 'id y status son requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabase = createServiceClient()

    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, status, confirmed_at, client_id, service_type, booking_date')
      .eq('id', id)
      .single()

    if (fetchError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Reserva no encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (booking.status === 'cancelled') {
      return new Response(
        JSON.stringify({ error: 'No se puede modificar una reserva cancelada' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (booking.status === 'completed') {
      return new Response(
        JSON.stringify({ error: 'No se puede modificar una reserva completada' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const updates: Record<string, unknown> = { status }
    if (internal_notes) updates.internal_notes = internal_notes
    if (cancelled_reason) updates.cancelled_reason = cancelled_reason
    if (status === 'confirmed' && !booking.confirmed_at) {
      updates.confirmed_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: `Error al actualizar: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Send completion email if marked as completed
    if (status === 'completed') {
      const { data: client } = await supabase
        .from('clients')
        .select('full_name, email, language')
        .eq('id', booking.client_id)
        .single()

      const { data: bookingInstructors } = await supabase
        .from('booking_instructors')
        .select('instructor_id, instructors (id, full_name)')
        .eq('booking_id', id)
        .limit(1)

      if (client) {
        const lang = client.language ?? 'es'
        const es = lang === 'es'
        const webUrl = getWebUrl()
        const instructor = bookingInstructors?.[0]?.instructors as { id: string; full_name: string } | null
        const reviewPath = instructor
          ? (es ? `/instructores/${instructor.id}` : `/en/instructors/${instructor.id}`)
          : (es ? '/' : '/en')

        const service = es
          ? (SERVICE_LABELS_ES[booking.service_type] ?? booking.service_type)
          : (SERVICE_LABELS_EN[booking.service_type] ?? booking.service_type)

        const instructorLine = instructor?.full_name
          ? (es
              ? `Esperamos que hayas disfrutado tu sesión con <strong>${instructor.full_name}</strong>.`
              : `We hope you enjoyed your session with <strong>${instructor.full_name}</strong>.`)
          : (es
              ? 'Esperamos que hayas disfrutado tu sesión.'
              : 'We hope you enjoyed your session.')

        const subject = es
          ? `¡Gracias por surfear con nosotros! — ${service}`
          : `Thanks for surfing with us! — ${service}`

        const html = `<!DOCTYPE html>
<html lang="${es ? 'es' : 'en'}">
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #0077b6;">Surfers Lab CR</h2>
  <p>${es ? 'Hola' : 'Hi'} <strong>${client.full_name}</strong>,</p>
  <p>${es
    ? `¡Gracias por tu <strong>${service}</strong> el <strong>${booking.booking_date}</strong>!`
    : `Thank you for your <strong>${service}</strong> on <strong>${booking.booking_date}</strong>!`
  }</p>
  <p>${instructorLine}</p>
  <p>${es
    ? 'Tu opinión nos ayuda a mejorar y ayuda a otros viajeros a elegir su experiencia. ¿Nos dejarías una reseña rápida?'
    : 'Your feedback helps us improve and helps other travelers choose their experience. Would you leave us a quick review?'
  }</p>
  <a href="${webUrl}${reviewPath}" style="display: inline-block; background: #0077b6; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold;">
    ${es ? 'Dejar reseña' : 'Leave a review'}
  </a>
  <p style="margin-top: 24px; font-size: 13px; color: #999;">
    ${es ? '¡Nos encantaría verte de nuevo en el agua! Pura vida 🤙' : "We'd love to see you back in the water! Pura vida 🤙"}
  </p>
</body>
</html>`

        sendEmail({ to: client.email, subject, html }).catch((err) =>
          console.error(`Failed to send completion email for booking ${id}:`, err),
        )
      }
    }

    // Re-fetch full booking for response
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
        data: updated ? mapBooking(updated) : { id, status },
        message: `Reserva marcada como ${status}`,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('update-booking-status error:', err)
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
