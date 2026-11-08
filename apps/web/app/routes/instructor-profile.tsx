import { useLoaderData, useLocation } from 'react-router'
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createSupabaseClient } from '@surf-app/supabase'
import InstructorProfilePage from '../../src/pages/InstructorProfilePage'
import { buildRouteMeta, buildBreadcrumbs, getLang } from '../seo'
import type { Route } from './+types/instructor-profile'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export function meta({ data, location }: Route.MetaArgs) {
  const lang = getLang(location.pathname)
  const instructor = data?.instructor
  const name = instructor?.full_name ?? (lang === 'es' ? 'Instructor' : 'Instructor')
  const bio = instructor
    ? (lang === 'en' ? instructor.bio_en || instructor.bio : instructor.bio) || ''
    : ''
  const path = lang === 'en'
    ? `/en/instructors/${data?.instructorId ?? ''}`
    : `/instructores/${data?.instructorId ?? ''}`
  return buildRouteMeta({
    title: name,
    description: bio.substring(0, 160),
    lang,
    path,
    schemas: [buildBreadcrumbs(path, lang, name)],
  })
}

export function headers() {
  return { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' }
}

export async function loader({ params }: Route.LoaderArgs) {
  const id = params.id
  const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['instructors', 'public', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('instructors')
          .select('id, full_name, email, photo_url, bio, bio_en, is_active')
          .eq('id', id)
          .eq('is_active', true)
          .single()
        if (error || !data) throw new Error('Instructor not found')
        return data
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['instructor-reviews', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('instructor_reviews')
          .select('id, client_name, rating, comment, created_at')
          .eq('instructor_id', id)
          .order('created_at', { ascending: false })
        if (error) throw new Error('Error loading reviews')
        const reviews = data ?? []
        const avg = reviews.length > 0
          ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
          : 0
        return {
          data: reviews,
          meta: { count: reviews.length, average_rating: Math.round(avg * 10) / 10 },
        }
      },
    }),
  ])

  const instructorData = queryClient.getQueryData<{ id: string; full_name: string; bio: string; bio_en: string | null }>(['instructors', 'public', id])

  return { dehydratedState: dehydrate(queryClient), instructor: instructorData ?? null, instructorId: id }
}

export default function InstructorProfile() {
  const { dehydratedState } = useLoaderData<typeof loader>()
  const { pathname } = useLocation()

  return (
    <HydrationBoundary state={dehydratedState}>
      <InstructorProfilePage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
    </HydrationBoundary>
  )
}
