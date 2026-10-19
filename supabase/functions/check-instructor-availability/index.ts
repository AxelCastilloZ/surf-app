import { createServiceClient, createAnonClient } from '../_shared/supabase.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'

interface CalendarEvent {
  summary: string
  start: string
  end: string
}

interface AvailabilityResult {
  available: boolean
  conflictingEvents: CalendarEvent[]
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

    const { booking_id } = await req.json()

    if (!booking_id) {
      return new Response(
        JSON.stringify({ error: 'booking_id requerido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabase = createServiceClient()

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, booking_date, start_time, end_time')
      .eq('id', booking_id)
      .single()

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Reserva no encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { data: instructors } = await supabase
      .from('instructors')
      .select('id, full_name, google_calendar_id')
      .eq('is_active', true)
      .order('full_name', { ascending: true })

    const clientEmail = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL')
    const rawKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY')

    const results = await Promise.all(
      (instructors ?? []).map(async (inst) => {
        const availability = await checkCalendarAvailability(
          clientEmail,
          rawKey,
          inst.google_calendar_id ?? '',
          booking.booking_date,
          booking.start_time,
          booking.end_time,
        )
        return {
          instructor_id: inst.id,
          full_name: inst.full_name,
          has_calendar: !!inst.google_calendar_id,
          ...availability,
        }
      }),
    )

    return new Response(
      JSON.stringify({
        data: {
          booking_id: booking.id,
          booking_date: booking.booking_date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          instructors: results,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('check-instructor-availability error:', err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number)
  const newH = Math.min(h + hours, 23)
  return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

async function getAccessToken(clientEmail: string, privateKeyPem: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }

  const enc = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const unsignedToken = `${enc(header)}.${enc(payload)}`

  const keyData = privateKeyPem
    .replace(/-----BEGIN (RSA )?PRIVATE KEY-----/, '')
    .replace(/-----END (RSA )?PRIVATE KEY-----/, '')
    .replace(/\s/g, '')

  const binaryKey = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(unsignedToken),
  )

  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const jwt = `${unsignedToken}.${sig}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  })

  const data = await res.json() as { access_token?: string; error?: string }
  if (!data.access_token) {
    throw new Error(`Token exchange failed: ${data.error ?? 'unknown'}`)
  }
  return data.access_token
}

async function checkCalendarAvailability(
  clientEmail: string | undefined,
  rawKey: string | undefined,
  calendarId: string,
  date: string,
  startTime: string,
  endTime?: string | null,
): Promise<AvailabilityResult> {
  if (!calendarId || !clientEmail || !rawKey) {
    return { available: true, conflictingEvents: [] }
  }

  const privateKey = rawKey.replace(/\\n/g, '\n')
  const defaultEnd = addHours(startTime, 2)
  const timeMin = `${date}T${startTime}:00-06:00`
  const timeMax = `${date}T${endTime ?? defaultEnd}:00-06:00`

  try {
    const accessToken = await getAccessToken(clientEmail, privateKey)

    const url =
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events` +
      `?timeMin=${encodeURIComponent(timeMin)}` +
      `&timeMax=${encodeURIComponent(timeMax)}` +
      `&singleEvents=true` +
      `&orderBy=startTime`

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      console.error(`Calendar API error for ${calendarId}: ${res.status}`)
      return { available: true, conflictingEvents: [] }
    }

    const data = await res.json() as { items?: Array<{
      summary?: string
      start?: { dateTime?: string; date?: string }
      end?: { dateTime?: string; date?: string }
    }> }

    const events = (data.items ?? [])
      .filter((e) => e.start && e.end)
      .map((e) => ({
        summary: e.summary ?? '(Sin título)',
        start: e.start!.dateTime ?? e.start!.date ?? '',
        end: e.end!.dateTime ?? e.end!.date ?? '',
      }))

    return { available: events.length === 0, conflictingEvents: events }
  } catch (err) {
    console.error(`Failed to check calendar ${calendarId}:`, (err as Error).message)
    return { available: true, conflictingEvents: [] }
  }
}
