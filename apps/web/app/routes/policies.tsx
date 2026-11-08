import { useLocation } from 'react-router'
import PoliciesPage from '../../src/pages/PoliciesPage'
import { buildRouteMeta, buildBreadcrumbs, getLang } from '../seo'
import type { Route } from './+types/policies'

const SEO = {
  es: {
    title: 'Políticas',
    description: 'Políticas de cancelación y privacidad de Surfers Lab CR, escuela de surf en Nosara, Guanacaste.',
  },
  en: {
    title: 'Policies',
    description: 'Cancellation and privacy policies for Surfers Lab CR, surf school in Nosara, Guanacaste.',
  },
}

export function meta({ location }: Route.MetaArgs) {
  const lang = getLang(location.pathname)
  const path = lang === 'es' ? '/politicas' : '/en/policies'
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

export default function Policies() {
  const { pathname } = useLocation()
  return <PoliciesPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
