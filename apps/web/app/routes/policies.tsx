import { useLocation } from 'react-router'
import PoliciesPage from '../../src/pages/PoliciesPage'

export default function Policies() {
  const { pathname } = useLocation()
  return <PoliciesPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
