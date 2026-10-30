import { useLoaderData, useLocation } from 'react-router'
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createSupabaseClient } from '@surf-app/supabase'
import BlogPostPage from '../../src/pages/BlogPostPage'
import type { Route } from './+types/blog-post'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export function headers() {
  return { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' }
}

export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug
  const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()
      if (error) return null
      return data
    },
  })

  return { dehydratedState: dehydrate(queryClient) }
}

export default function BlogPost() {
  const { dehydratedState } = useLoaderData<typeof loader>()
  const { pathname } = useLocation()

  return (
    <HydrationBoundary state={dehydratedState}>
      <BlogPostPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
    </HydrationBoundary>
  )
}
