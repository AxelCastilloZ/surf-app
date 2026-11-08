import { useLocation } from 'react-router'
import ConfirmBookingPage from '../../src/pages/ConfirmBookingPage'
import { buildRouteMeta, getLang } from '../seo'
import type { Route } from './+types/confirm-booking'

export function meta({ location }: Route.MetaArgs) {
  const lang = getLang(location.pathname)
  return buildRouteMeta({
    title: lang === 'es' ? 'Confirmar Reserva' : 'Confirm Booking',
    description: lang === 'es' ? 'Confirma tu reserva en Surfers Lab CR.' : 'Confirm your booking at Surfers Lab CR.',
    lang,
    path: location.pathname,
    noindex: true,
  })
}

export default function ConfirmBooking() {
  const { pathname } = useLocation()
  return <ConfirmBookingPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
