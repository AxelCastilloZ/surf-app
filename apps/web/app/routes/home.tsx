import { useLoaderData, useLocation } from 'react-router'
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createSupabaseClient } from '@surf-app/supabase'
import LandingPage from '../../src/pages/LandingPage'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export async function loader() {
  const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['instructors', 'public'],
      queryFn: async () => {
        const { data } = await supabase
          .from('instructors')
          .select('id, full_name, email, photo_url, bio, bio_en, is_active')
          .eq('is_active', true)
          .order('full_name', { ascending: true })
        return data ?? []
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['packages'],
      queryFn: async () => {
        const { data } = await supabase
          .from('packages')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
        return data ?? []
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['gallery', 'all'],
      queryFn: async () => {
        const { data } = await supabase
          .from('gallery_items')
          .select('*')
          .eq('is_visible', true)
          .order('sort_order', { ascending: true })
        return data ?? []
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['site-setting', 'hero_image_url'],
      queryFn: async () => {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero_image_url')
          .single()
        return data?.value ?? null
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['site-setting', 'hero_image_position'],
      queryFn: async () => {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero_image_position')
          .single()
        return data?.value ?? null
      },
    }),
  ])

  return { dehydratedState: dehydrate(queryClient) }
}

export default function Home() {
  const { dehydratedState } = useLoaderData<typeof loader>()
  const { pathname } = useLocation()

  return (
    <HydrationBoundary state={dehydratedState}>
      <LandingPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
    </HydrationBoundary>
  )
}
