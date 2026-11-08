import { useLocation } from 'react-router'
import FaqPage from '../../src/pages/FaqPage'
import { buildRouteMeta, buildBreadcrumbs, getLang } from '../seo'
import type { Route } from './+types/faq'

const SEO = {
  es: {
    title: 'Preguntas Frecuentes',
    description: 'Preguntas frecuentes sobre clases de surf, reservas, políticas y más en Surfers Lab CR, Nosara, Costa Rica.',
  },
  en: {
    title: 'Frequently Asked Questions',
    description: 'Frequently asked questions about surf lessons, bookings, policies and more at Surfers Lab CR, Nosara, Costa Rica.',
  },
}

export function meta({ location }: Route.MetaArgs) {
  const lang = getLang(location.pathname)
  const path = lang === 'es' ? '/preguntas-frecuentes' : '/en/faq'
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
  return { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }
}

export default function Faq() {
  const { pathname } = useLocation()
  return <FaqPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
