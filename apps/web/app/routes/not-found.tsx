import { useLocation } from 'react-router'
import NotFoundPage from '../../src/pages/NotFoundPage'
import { buildRouteMeta, getLang } from '../seo'
import type { Route } from './+types/not-found'

export function meta({ location }: Route.MetaArgs) {
  const lang = getLang(location.pathname)
  return buildRouteMeta({
    title: lang === 'es' ? 'Página no encontrada' : 'Page not found',
    description: lang === 'es' ? 'La página que buscas no existe.' : "The page you're looking for doesn't exist.",
    lang,
    path: location.pathname,
    noindex: true,
  })
}

export default function NotFound() {
  return <NotFoundPage />
}
