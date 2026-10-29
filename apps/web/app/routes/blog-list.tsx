import { useLocation } from 'react-router'
import BlogListPage from '../../src/pages/BlogListPage'

export function headers() {
  return { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' }
}

export default function BlogList() {
  const { pathname } = useLocation()
  return <BlogListPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
