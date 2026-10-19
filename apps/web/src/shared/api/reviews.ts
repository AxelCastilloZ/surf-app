import { supabase } from '../../lib/supabase'

export interface GoogleReview {
  author_name: string
  rating: number
  text: string
  time: number
  profile_photo_url?: string
  relative_time_description: string
}

export async function fetchReviews(): Promise<GoogleReview[]> {
  const { data, error } = await supabase.functions.invoke('google-reviews')

  if (error) {
    console.warn('Google reviews Edge Function not available yet:', error.message)
    return []
  }

  const reviews = data as GoogleReview[] | null
  return Array.isArray(reviews) ? reviews : []
}
