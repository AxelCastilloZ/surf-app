import { useLocation } from 'react-router'
import FaqPage from '../../src/pages/FaqPage'

export function headers() {
  return { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }
}

export default function Faq() {
  const { pathname } = useLocation()
  return <FaqPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
