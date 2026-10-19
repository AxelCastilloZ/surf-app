import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

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
  const { data, error } = await supabase
    .from('instructor_reviews')
    .select('id, client_name, rating, comment, created_at')
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Error al cargar reseñas')

  const reviews = (data ?? []) as InstructorReview[]
  const avg = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return {
    data: reviews,
    meta: {
      count: reviews.length,
      average_rating: Math.round(avg * 10) / 10,
    },
  }
}

export function useInstructorReviews(instructorId: string) {
  return useQuery({
    queryKey: ['instructor-reviews', instructorId],
    queryFn: () => fetchReviews(instructorId),
    staleTime: 1000 * 60 * 5,
  })
}
