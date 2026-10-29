import { useLocation } from 'react-router'
import PoliciesPage from '../../src/pages/PoliciesPage'

export function headers() {
  return { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }
}

export default function Policies() {
  const { pathname } = useLocation()
  return <PoliciesPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
