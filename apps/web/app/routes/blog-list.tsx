import { useLocation } from 'react-router'
import BlogListPage from '../../src/pages/BlogListPage'
import { buildRouteMeta, buildBreadcrumbs, getLang } from '../seo'
import type { Route } from './+types/blog-list'

const SEO = {
  es: {
    title: 'Blog — Surf en Nosara, Costa Rica',
    description: 'Artículos sobre surf en Nosara, Playa Guiones y Costa Rica. Guías para principiantes, mejores épocas para surfear, tips y más.',
  },
  en: {
    title: 'Blog — Surfing in Nosara, Costa Rica',
    description: 'Articles about surfing in Nosara, Playa Guiones and Costa Rica. Beginner guides, best times to surf, tips and more.',
  },
}

export function meta({ location }: Route.MetaArgs) {
  const lang = getLang(location.pathname)
  const path = lang === 'es' ? '/blog' : '/en/blog'
  const seo = SEO[lang]
  return buildRouteMeta({
    title: seo.title,
    description: seo.description,
    lang,
    path,
    schemas: [buildBreadcrumbs(path, lang, 'Blog')],
  })
}

export function headers() {
  return { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' }
}

export default function BlogList() {
  const { pathname } = useLocation()
  return <BlogListPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
