import { useLocation } from 'react-router'
import BookingFormPage from '../../src/pages/BookingFormPage'

export default function Booking() {
  const { pathname } = useLocation()
  return <BookingFormPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
