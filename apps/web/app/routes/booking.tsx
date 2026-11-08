import { useLocation } from 'react-router'
import BookingFormPage from '../../src/pages/BookingFormPage'
import { buildRouteMeta, buildBreadcrumbs, getLang } from '../seo'
import type { Route } from './+types/booking'

const SEO = {
  es: {
    title: 'Reservar',
    description: 'Reserva tu clase de surf en Nosara, Guanacaste, Costa Rica.',
  },
  en: {
    title: 'Book Now',
    description: 'Book your surf lesson in Nosara, Guanacaste, Costa Rica.',
  },
}

export function meta({ location }: Route.MetaArgs) {
  const lang = getLang(location.pathname)
  const path = lang === 'es' ? '/reservar' : '/en/book'
  const seo = SEO[lang]
  return buildRouteMeta({
    title: seo.title,
    description: seo.description,
    lang,
    path,
    schemas: [buildBreadcrumbs(path, lang, seo.title)],
  })
}

export default function Booking() {
  const { pathname } = useLocation()
  return <BookingFormPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
