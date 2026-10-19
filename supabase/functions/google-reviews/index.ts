import { corsHeaders, handleCors } from '../_shared/cors.ts'

interface GoogleReview {
  author_name: string
  rating: number
  text: string
  time: number
  profile_photo_url?: string
  relative_time_description: string
}

const MAX_REVIEWS = 10
const MIN_RATING = 4
const CACHE_TTL_MS = 86_400_000 // 24 hours

let cache: { data: GoogleReview[]; timestamp: number } | null = null

Deno.serve(async (req) => {
  const corsRes = handleCors(req)
  if (corsRes) return corsRes

  try {
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')
    const placeId = Deno.env.get('GOOGLE_PLACE_ID')

    if (!apiKey || !placeId) {
      console.warn('GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID not set')
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
      return new Response(JSON.stringify(cache.data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=reviews` +
      `&key=${apiKey}`

    const response = await fetch(url)

    if (!response.ok) {
      console.error(`Google Places API responded with status ${response.status}`)
      return new Response(JSON.stringify(cache?.data ?? []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const json = await response.json() as {
      result?: { reviews?: GoogleReview[] }
      status?: string
      error_message?: string
    }

    if (json.status !== 'OK') {
      console.error(`Google Places API error: ${json.status} — ${json.error_message ?? ''}`)
      return new Response(JSON.stringify(cache?.data ?? []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const raw = json.result?.reviews ?? []

    const filtered = raw
      .filter((r) => r.rating >= MIN_RATING && r.text?.trim())
      .sort((a, b) => b.rating - a.rating || b.time - a.time)
      .slice(0, MAX_REVIEWS)

    cache = { data: filtered, timestamp: Date.now() }

    return new Response(JSON.stringify(filtered), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('google-reviews error:', err)
    return new Response(JSON.stringify(cache?.data ?? []), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
