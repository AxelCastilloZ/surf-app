export interface GoogleReview {
  author_name: string
  rating: number
  text: string
  time: number
  profile_photo_url?: string
  relative_time_description: string
}

const API_URL = import.meta.env.VITE_API_URL as string

export async function fetchReviews(): Promise<GoogleReview[]> {
  const res = await fetch(`${API_URL}/reviews`)
  if (!res.ok) throw new Error('Error al cargar las reseñas')

  const json = await res.json()
  // La API devuelve GoogleReview[] directamente (sin wrapper { data })
  return Array.isArray(json) ? json : (json.data ?? [])
}
