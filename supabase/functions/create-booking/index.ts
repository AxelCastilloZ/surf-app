import { createServiceClient } from '../_shared/supabase.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { sendEmail, getStaffEmail, getWebUrl } from '../_shared/resend.ts'

const TOKEN_EXPIRY_HOURS = 48

const SERVICE_LABELS: Record<string, string> = {
  surf_lesson: 'Surf Lesson',
  video_analysis: 'Video Analysis',
  surf_trip: 'Surf Trip',
}

interface CreateBookingBody {
  full_name: string
  email: string
  phone?: string
  country?: string
  language?: string
  package_id?: string
  instructor_id?: string
  service_type: string
  booking_date: string
  start_time: string
  end_time?: string
  participants?: number
  currency?: string
  medical_notes: string
  notes?: string
}

Deno.serve(async (req) => {
  const corsRes = handleCors(req)
  if (corsRes) return corsRes

  try {
    const body: CreateBookingBody = await req.json()

    if (!body.full_name || !body.email || !body.service_type || !body.booking_date || !body.start_time) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabase = createServiceClient()
    const participants = body.participants ?? 1
    const currency = body.currency ?? 'USD'

    // 1. Find or create client
    const emailLower = body.email.toLowerCase()
    const { data: existingClient } = await supabase
      .from('clients')
      .select('*')
      .eq('email', emailLower)
      .single()

    let clientId: string

    if (existingClient) {
      const updates: Record<string, string> = {}
      if (body.full_name) updates.full_name = body.full_name
      if (body.phone) updates.phone = body.phone
      if (body.country) updates.country = body.country
      if (body.language) updates.language = body.language

      if (Object.keys(updates).length > 0) {
        await supabase.from('clients').update(updates).eq('id', existingClient.id)
      }
      clientId = existingClient.id
    } else {
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          full_name: body.full_name,
          email: emailLower,
          phone: body.phone ?? null,
          country: body.country ?? null,
          language: body.language ?? 'es',
        })
        .select('id')
        .single()

      if (clientError || !newClient) {
        return new Response(
          JSON.stringify({ error: `Error creando cliente: ${clientError?.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
      clientId = newClient.id
    }

    // 2. Calculate price from pricing tiers
    const { data: tier } = await supabase
      .from('service_pricing_tiers')
      .select('price_per_person')
      .eq('service_type', body.service_type)
      .eq('is_active', true)
      .lte('min_participants', participants)
      .gte('max_participants', participants)
      .single()

    const totalPrice = tier ? Number(tier.price_per_person) * participants : 0

    // 3. Generate confirmation token
    const confirmationToken = crypto.randomUUID()
    const tokenExpiresAt = new Date()
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + TOKEN_EXPIRY_HOURS)

    // 4. Insert booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        client_id: clientId,
        package_id: body.package_id ?? null,
        service_type: body.service_type,
        booking_date: body.booking_date,
        start_time: body.start_time,
        end_time: body.end_time ?? null,
        participants,
        status: 'pending',
        total_price: totalPrice,
        currency,
        medical_notes: body.medical_notes,
        notes: body.notes ?? null,
        confirmation_token: confirmationToken,
        token_expires_at: tokenExpiresAt.toISOString(),
      })
      .select('id, status, confirmation_token, token_expires_at')
      .single()

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: `Error creando reserva: ${bookingError?.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // 5. Link preferred instructor if provided
    let instructorName: string | null = null
    if (body.instructor_id) {
      const { data: inst } = await supabase
        .from('instructors')
        .select('id, full_name')
        .eq('id', body.instructor_id)
        .eq('is_active', true)
        .single()

      if (inst) {
        await supabase.from('booking_instructors').insert({
          booking_id: booking.id,
          instructor_id: inst.id,
        })
        instructorName = inst.full_name
      }
    }

    // 6. Send emails (fire and forget)
    const webUrl = getWebUrl()
    const confirmUrl = `${webUrl}/confirmar-reserva/${confirmationToken}`
    const serviceLabel = SERVICE_LABELS[body.service_type] ?? body.service_type

    sendEmail({
      to: emailLower,
      subject: `Confirma tu reserva — ${serviceLabel}`,
      html: buildConfirmationHtml({
        bookingId: booking.id,
        clientName: body.full_name,
        serviceName: serviceLabel,
        bookingDate: body.booking_date,
        startTime: body.start_time,
        participants,
        totalPrice,
        currency,
        confirmUrl,
        instructorName,
      }),
    }).catch((err) => console.error('Failed to send confirmation email:', err))

    const staffEmail = getStaffEmail()
    if (staffEmail) {
      const { data: activeInstructors } = await supabase
        .from('instructors')
        .select('full_name')
        .eq('is_active', true)
        .order('full_name', { ascending: true })

      sendEmail({
        to: staffEmail,
        subject: `Nueva reserva: ${body.full_name} — ${serviceLabel}`,
        html: buildStaffNotificationHtml({
          bookingId: booking.id,
          clientName: body.full_name,
          clientEmail: emailLower,
          clientPhone: body.phone,
          serviceName: serviceLabel,
          bookingDate: body.booking_date,
          startTime: body.start_time,
          participants,
          totalPrice,
          currency,
          instructorName,
          availableInstructors: (activeInstructors ?? []).map((i: { full_name: string }) => i.full_name),
        }),
      }).catch((err) => console.error('Failed to send staff notification:', err))
    }

    return new Response(
      JSON.stringify({
        data: {
          id: booking.id,
          status: booking.status,
          confirmation_token: booking.confirmation_token,
          token_expires_at: booking.token_expires_at,
        },
        message: 'Reserva creada. Revisa tu email para confirmarla.',
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('create-booking error:', err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})

// --- Email HTML builders ---

interface ConfirmationData {
  bookingId: string
  clientName: string
  serviceName: string
  bookingDate: string
  startTime: string
  participants: number
  totalPrice: number
  currency: string
  confirmUrl: string
  instructorName: string | null
}

function buildConfirmationHtml(d: ConfirmationData): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #0077b6;">Surfers Lab CR</h2>
  <p>Hola <strong>${d.clientName}</strong>,</p>
  <p>Recibimos tu reserva. Confirma haciendo clic en el botón:</p>
  <table style="margin: 24px 0; width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; color: #666;">Servicio</td><td style="padding: 8px 0;"><strong>${d.serviceName}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Fecha</td><td style="padding: 8px 0;"><strong>${d.bookingDate}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Hora</td><td style="padding: 8px 0;"><strong>${d.startTime}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Participantes</td><td style="padding: 8px 0;"><strong>${d.participants}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Total</td><td style="padding: 8px 0;"><strong>${d.currency} ${d.totalPrice}</strong></td></tr>${d.instructorName ? `
    <tr><td style="padding: 8px 0; color: #666;">Instructor</td><td style="padding: 8px 0;"><strong>${d.instructorName}</strong></td></tr>` : ''}
  </table>
  <a href="${d.confirmUrl}" style="display: inline-block; background: #0077b6; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold;">Confirmar reserva</a>
  <p style="margin-top: 24px; font-size: 13px; color: #999;">Este link expira en 48 horas. Si no realizaste esta reserva, puedes ignorar este email.</p>
  <p style="margin-top: 16px; padding: 12px; background: #f0f9ff; border-radius: 6px; font-size: 13px; color: #555;">Tu ID de reserva es: <strong style="font-family: monospace;">${d.bookingId}</strong><br>Guárdalo — lo necesitarás si deseas dejar una reseña a tu instructor después de la clase.</p>
</body>
</html>`
}

interface StaffNotificationData {
  bookingId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  serviceName: string
  bookingDate: string
  startTime: string
  participants: number
  totalPrice: number
  currency: string
  instructorName: string | null
  availableInstructors: string[]
}

function buildStaffNotificationHtml(d: StaffNotificationData): string {
  const phoneLine = d.clientPhone
    ? `<tr><td style="padding: 8px 0; color: #666;">Teléfono</td><td style="padding: 8px 0;"><a href="https://wa.me/${d.clientPhone.replace(/[^0-9]/g, '')}" style="color: #0077b6;">${d.clientPhone}</a></td></tr>`
    : ''

  const instructorsBlock = d.availableInstructors.length > 0
    ? `<div style="margin-top: 16px; padding: 12px; background: #fffbeb; border: 1px solid #fbbf24; border-radius: 6px;">
    <p style="margin: 0 0 8px; font-weight: bold; color: #92400e;">Instructores disponibles en ese horario:</p>
    <ul style="margin: 0; padding-left: 20px; color: #78350f;">${d.availableInstructors.map((n) => `<li>${n}</li>`).join('')}</ul>
  </div>`
    : ''

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #0077b6;">Nueva reserva recibida</h2>
  <table style="margin: 16px 0; width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; color: #666;">ID Reserva</td><td style="padding: 8px 0; font-family: monospace;">${d.bookingId}</td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Cliente</td><td style="padding: 8px 0;"><strong>${d.clientName}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${d.clientEmail}</td></tr>
    ${phoneLine}
    <tr><td style="padding: 8px 0; color: #666;">Servicio</td><td style="padding: 8px 0;"><strong>${d.serviceName}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Fecha</td><td style="padding: 8px 0;"><strong>${d.bookingDate}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Hora</td><td style="padding: 8px 0;"><strong>${d.startTime}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Participantes</td><td style="padding: 8px 0;">${d.participants}</td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Total</td><td style="padding: 8px 0;"><strong>${d.currency} ${d.totalPrice}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Instructor</td><td style="padding: 8px 0;"><strong>${d.instructorName ?? 'Sin preferencia'}</strong></td></tr>
  </table>
  ${instructorsBlock}
  <p style="margin-top: 16px; font-size: 13px; color: #999;">Estado: pendiente de confirmación por email del cliente.</p>
</body>
</html>`
}
