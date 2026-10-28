import { useLocation } from 'react-router'
import GalleryPage from '../../src/pages/GalleryPage'

export default function Gallery() {
  const { pathname } = useLocation()
  return <GalleryPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
