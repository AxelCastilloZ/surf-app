import { useLocation } from 'react-router'
import ConfirmBookingPage from '../../src/pages/ConfirmBookingPage'

export default function ConfirmBooking() {
  const { pathname } = useLocation()
  return <ConfirmBookingPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
