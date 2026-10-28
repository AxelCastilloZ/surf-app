import { useLocation } from 'react-router'
import FaqPage from '../../src/pages/FaqPage'

export default function Faq() {
  const { pathname } = useLocation()
  return <FaqPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
