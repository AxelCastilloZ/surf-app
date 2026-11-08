import { useLoaderData, useLocation } from 'react-router'
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createSupabaseClient } from '@surf-app/supabase'
import BlogPostPage from '../../src/pages/BlogPostPage'
import { buildRouteMeta, buildBreadcrumbs, getLang } from '../seo'
import type { Route } from './+types/blog-post'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export function meta({ data, location }: Route.MetaArgs) {
  const lang = getLang(location.pathname)
  const post = data?.post
  if (!post) {
    return buildRouteMeta({
      title: lang === 'es' ? 'Artículo no encontrado' : 'Article not found',
      description: '',
      lang,
      path: location.pathname,
      noindex: true,
    })
  }
  const title = lang === 'en' ? (post.title_en || post.title) : post.title
  const description = lang === 'en'
    ? (post.meta_description_en || post.meta_description || post.excerpt_en || post.excerpt || '')
    : (post.meta_description || post.excerpt || '')
  const path = lang === 'en' ? `/en/blog/${post.slug}` : `/blog/${post.slug}`
  return buildRouteMeta({
    title,
    description,
    lang,
    path,
    ogImage: post.cover_image || undefined,
    schemas: [
      buildBreadcrumbs(path, lang, title),
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        image: post.cover_image || undefined,
        datePublished: post.published_at,
        author: { '@type': 'Organization', name: 'Surfers Lab CR' },
        publisher: { '@type': 'Organization', name: 'Surfers Lab CR' },
      },
    ],
  })
}

export function headers() {
  return { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' }
}

export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug
  const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  const queryClient = new QueryClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  await queryClient.prefetchQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => post,
  })

  return { dehydratedState: dehydrate(queryClient), post }
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
