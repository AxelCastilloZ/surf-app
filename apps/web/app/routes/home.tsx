import { useLoaderData, useLocation } from 'react-router'
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createSupabaseClient } from '@surf-app/supabase'
import LandingPage from '../../src/pages/LandingPage'
import { buildRouteMeta, buildLocalBusinessSchema, getLang } from '../seo'
import type { Route } from './+types/home'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const SEO = {
  es: {
    title: 'Escuela de Surf en Playa Guiones, Nosara',
    description: 'Clases de surf en Playa Guiones, Nosara, Costa Rica. Instructores certificados ISA, video análisis y surf trips por Guanacaste. Reserva tu lección hoy.',
  },
  en: {
    title: 'Surf School in Playa Guiones, Nosara',
    description: 'Surf lessons at Playa Guiones, Nosara, Costa Rica. ISA certified instructors, video analysis and surf trips across Guanacaste. Book your lesson today.',
  },
}

export function meta({ location }: Route.MetaArgs) {
  const lang = getLang(location.pathname)
  const path = lang === 'es' ? '/' : '/en'
  const seo = SEO[lang]
  return buildRouteMeta({
    title: seo.title,
    description: seo.description,
    lang,
    path,
    schemas: [buildLocalBusinessSchema(seo.description, lang)],
  })
}

export function headers() {
  return {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
  }
}

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
