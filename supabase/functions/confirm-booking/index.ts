import { createServiceClient } from '../_shared/supabase.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  const corsRes = handleCors(req)
  if (corsRes) return corsRes

  try {
    const { token } = await req.json()

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token requerido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabase = createServiceClient()

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('id, status, confirmed_at, token_expires_at')
      .eq('confirmation_token', token)
      .single()

    if (error || !booking) {
      return new Response(
        JSON.stringify({ error: 'Token de confirmación inválido' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (booking.confirmed_at) {
      return new Response(
        JSON.stringify({ error: 'Esta reserva ya fue confirmada' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (booking.status === 'cancelled') {
      return new Response(
        JSON.stringify({ error: 'Esta reserva fue cancelada' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (booking.token_expires_at && new Date(booking.token_expires_at) < new Date()) {
      await supabase
        .from('bookings')
        .update({ status: 'expired' })
        .eq('id', booking.id)

      return new Response(
        JSON.stringify({ error: 'El link de confirmación ha expirado. Realiza una nueva reserva.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('id', booking.id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: `Error al confirmar: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({
        data: { id: booking.id, status: 'confirmed' },
        message: 'Reserva confirmada exitosamente',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('confirm-booking error:', err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
