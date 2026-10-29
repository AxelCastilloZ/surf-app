import { useLocation } from 'react-router'
import InstructorProfilePage from '../../src/pages/InstructorProfilePage'

export function headers() {
  return { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' }
}

export default function InstructorProfile() {
  const { pathname } = useLocation()
  return <InstructorProfilePage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
