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

    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`

    const response = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews',
      },
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error(`Places API responded with status ${response.status}: ${errText}`)
      return new Response(JSON.stringify(cache?.data ?? []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const json = await response.json() as {
      reviews?: {
        rating: number
        text?: { text: string }
        authorAttribution?: {
          displayName: string
          photoUri?: string
        }
        relativePublishTimeDescription?: string
        publishTime?: string
      }[]
    }

    const raw = json.reviews ?? []

    const filtered: GoogleReview[] = raw
      .filter((r) => r.rating >= MIN_RATING && r.text?.text?.trim())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, MAX_REVIEWS)
      .map((r) => ({
        author_name: r.authorAttribution?.displayName ?? 'Anonymous',
        rating: r.rating,
        text: r.text?.text ?? '',
        time: r.publishTime ? Math.floor(new Date(r.publishTime).getTime() / 1000) : 0,
        profile_photo_url: r.authorAttribution?.photoUri,
        relative_time_description: r.relativePublishTimeDescription ?? '',
      }))

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
