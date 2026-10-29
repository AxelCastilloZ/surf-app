import { useLocation } from 'react-router'
import GalleryPage from '../../src/pages/GalleryPage'

export function headers() {
  return { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' }
}

export default function Gallery() {
  const { pathname } = useLocation()
  return <GalleryPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
