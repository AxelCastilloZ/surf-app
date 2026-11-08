import { useLocation } from 'react-router'
import GalleryPage from '../../src/pages/GalleryPage'
import { buildRouteMeta, buildBreadcrumbs, getLang } from '../seo'
import type { Route } from './+types/gallery'

const SEO = {
  es: {
    title: 'Galería',
    description: 'Galería de fotos y videos de clases de surf, trips y video análisis en Nosara, Guanacaste, Costa Rica.',
  },
  en: {
    title: 'Gallery',
    description: 'Gallery of photos and videos from surf lessons, trips and video analysis in Nosara, Guanacaste, Costa Rica.',
  },
}

export function meta({ location }: Route.MetaArgs) {
  const lang = getLang(location.pathname)
  const path = lang === 'es' ? '/galeria' : '/en/gallery'
  const seo = SEO[lang]
  return buildRouteMeta({
    title: seo.title,
    description: seo.description,
    lang,
    path,
    schemas: [buildBreadcrumbs(path, lang, seo.title)],
  })
}

export function headers() {
  return { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' }
}

export default function Gallery() {
  const { pathname } = useLocation()
  return <GalleryPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
