import { createServiceClient } from '../_shared/supabase.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  const corsRes = handleCors(req)
  if (corsRes) return corsRes

  try {
    const { instructor_id, booking_id, rating, comment } = await req.json()

    if (!instructor_id || !booking_id || !rating) {
      return new Response(
        JSON.stringify({ error: 'instructor_id, booking_id y rating son requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: 'Rating debe ser entre 1 y 5' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabase = createServiceClient()

    // Verify instructor exists and is active
    const { data: instructor, error: instError } = await supabase
      .from('instructors')
      .select('id')
      .eq('id', instructor_id)
      .eq('is_active', true)
      .single()

    if (instError || !instructor) {
      return new Response(
        JSON.stringify({ error: 'Instructor no encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Verify booking exists and is completed
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, status, client_id')
      .eq('id', booking_id)
      .single()

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'No encontramos esa reserva. Verifica el ID e intenta de nuevo.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (booking.status !== 'completed') {
      return new Response(
        JSON.stringify({ error: 'Solo puedes dejar una reseña después de que tu clase haya sido completada.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Verify instructor was assigned to this booking
    const { data: assignment } = await supabase
      .from('booking_instructors')
      .select('instructor_id')
      .eq('booking_id', booking_id)
      .eq('instructor_id', instructor_id)
      .single()

    if (!assignment) {
      return new Response(
        JSON.stringify({ error: 'Esa reserva no corresponde a este instructor.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Check for duplicate review
    const { data: existing } = await supabase
      .from('instructor_reviews')
      .select('id')
      .eq('booking_id', booking_id)
      .single()

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Ya existe una reseña para esta reserva.' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Get client name
    const { data: client } = await supabase
      .from('clients')
      .select('full_name')
      .eq('id', booking.client_id)
      .single()

    // Insert review
    const { data: review, error: insertError } = await supabase
      .from('instructor_reviews')
      .insert({
        instructor_id,
        booking_id,
        client_name: client?.full_name ?? 'Anónimo',
        rating,
        comment: comment?.trim() || null,
      })
      .select()
      .single()

    if (insertError) {
      return new Response(
        JSON.stringify({ error: `Error al crear reseña: ${insertError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({ data: review, message: 'Reseña publicada. ¡Gracias!' }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('create-instructor-review error:', err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
