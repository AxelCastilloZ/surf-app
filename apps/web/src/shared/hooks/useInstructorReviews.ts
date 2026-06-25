import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL as string

export interface InstructorReview {
  id: string
  client_name: string
  rating: number
  comment: string | null
  created_at: string
}

interface ReviewsResponse {
  data: InstructorReview[]
  meta: { count: number; average_rating: number }
}

async function fetchReviews(instructorId: string): Promise<ReviewsResponse> {
  const res = await fetch(`${API_URL}/instructors/${instructorId}/reviews`)
  if (!res.ok) throw new Error('Error al cargar reseñas')
  return res.json()
}

export function useInstructorReviews(instructorId: string) {
  return useQuery({
    queryKey: ['instructor-reviews', instructorId],
    queryFn: () => fetchReviews(instructorId),
    staleTime: 1000 * 60 * 5,
  })
}
