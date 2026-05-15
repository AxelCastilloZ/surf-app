import { useQuery } from '@tanstack/react-query'
import { fetchReviews, GoogleReview } from '../api/reviews'

export function useReviews() {
  const { data, isLoading, isError } = useQuery<GoogleReview[]>({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas — mismo TTL que el cache del backend
  })

  return {
    reviews: data ?? [],
    isLoading,
    isError,
  }
}
