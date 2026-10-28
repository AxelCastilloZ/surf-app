import { useLocation } from 'react-router'
import InstructorProfilePage from '../../src/pages/InstructorProfilePage'

export default function InstructorProfile() {
  const { pathname } = useLocation()
  return <InstructorProfilePage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
