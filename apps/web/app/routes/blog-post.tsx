import { useLocation } from 'react-router'
import BlogPostPage from '../../src/pages/BlogPostPage'

export function headers() {
  return { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' }
}

export default function BlogPost() {
  const { pathname } = useLocation()
  return <BlogPostPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
