import { createServiceClient } from '../_shared/supabase.ts'
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
    const { booking_id } = await req.json()

    if (!booking_id) {
      return new Response(
        JSON.stringify({ error: 'booking_id requerido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabase = createServiceClient()

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('id, service_type, booking_date, start_time, client_id')
      .eq('id', booking_id)
      .single()

    if (error || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking no encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { data: client } = await supabase
      .from('clients')
      .select('full_name, email, language')
      .eq('id', booking.client_id)
      .single()

    if (!client) {
      return new Response(
        JSON.stringify({ error: 'Cliente no encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const lang = client.language ?? 'es'
    const es = lang === 'es'
    const webUrl = getWebUrl()
    const bookingUrl = es ? `${webUrl}/reservar` : `${webUrl}/en/book`
    const service = es
      ? (SERVICE_LABELS_ES[booking.service_type] ?? booking.service_type)
      : (SERVICE_LABELS_EN[booking.service_type] ?? booking.service_type)

    const subject = es
      ? `Tu reserva ha expirado — ${service}`
      : `Your booking has expired — ${service}`

    const html = `<!DOCTYPE html>
<html lang="${es ? 'es' : 'en'}">
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #0077b6;">Surfers Lab CR</h2>
  <p>${es ? 'Hola' : 'Hi'} <strong>${client.full_name}</strong>,</p>
  <p>${es
    ? `Tu reserva de <strong>${service}</strong> para el <strong>${booking.booking_date}</strong> a las <strong>${booking.start_time}</strong> no fue confirmada a tiempo y ha expirado.`
    : `Your <strong>${service}</strong> booking for <strong>${booking.booking_date}</strong> at <strong>${booking.start_time}</strong> was not confirmed in time and has expired.`
  }</p>
  <p>${es ? 'Si aún deseas reservar, puedes hacer una nueva reserva aquí:' : 'If you still want to book, you can make a new reservation here:'}</p>
  <a href="${bookingUrl}" style="display: inline-block; background: #0077b6; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold;">
    ${es ? 'Nueva reserva' : 'New booking'}
  </a>
  <p style="margin-top: 24px; font-size: 13px; color: #999;">
    ${es ? 'Si tienes preguntas, no dudes en contactarnos.' : "If you have any questions, don't hesitate to contact us."}
  </p>
</body>
</html>`

    await sendEmail({ to: client.email, subject, html })

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('send-expiration-emails error:', err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
