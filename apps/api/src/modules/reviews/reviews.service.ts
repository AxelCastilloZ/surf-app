import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface GoogleReview {
  author_name: string
  rating: number
  text: string
  time: number
  profile_photo_url?: string
  relative_time_description: string
}

const CACHE_TTL_MS = 86_400_000 // 24 horas
const CACHE_KEY = 'google_reviews'
const MAX_REVIEWS = 10
const MIN_RATING = 4

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name)
  private readonly cache = new Map<string, { data: GoogleReview[]; timestamp: number }>()

  constructor(private readonly config: ConfigService) {}

  async getReviews(): Promise<GoogleReview[]> {
    const apiKey = this.config.get<string>('GOOGLE_PLACES_API_KEY')
    const placeId = this.config.get<string>('GOOGLE_PLACE_ID')

    if (!apiKey || !placeId) {
      this.logger.warn('GOOGLE_PLACES_API_KEY o GOOGLE_PLACE_ID no están definidos — devolviendo []')
      return []
    }

    const cached = this.cache.get(CACHE_KEY)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      this.logger.debug('Devolviendo reviews desde cache')
      return cached.data
    }

    try {
      const url =
        `https://maps.googleapis.com/maps/api/place/details/json` +
        `?place_id=${encodeURIComponent(placeId)}` +
        `&fields=reviews` +
        `&key=${apiKey}`

      const response = await fetch(url)

      if (!response.ok) {
        this.logger.error(`Google Places API respondió con status ${response.status}`)
        return cached?.data ?? []
      }

      const json = (await response.json()) as {
        result?: { reviews?: GoogleReview[] }
        status?: string
        error_message?: string
      }

      if (json.status !== 'OK') {
        this.logger.error(`Google Places API error: ${json.status} — ${json.error_message ?? ''}`)
        return cached?.data ?? []
      }

      const raw = json.result?.reviews ?? []

      const filtered = raw
        .filter((r) => r.rating >= MIN_RATING && r.text?.trim())
        .sort((a, b) => b.rating - a.rating || b.time - a.time)
        .slice(0, MAX_REVIEWS)

      this.cache.set(CACHE_KEY, { data: filtered, timestamp: Date.now() })
      this.logger.log(`Reviews actualizadas desde Google: ${filtered.length} reseñas`)
      return filtered
    } catch (err) {
      this.logger.error('Error al llamar a Google Places API', (err as Error).message)
      return cached?.data ?? []
    }
  }
}
