import { useLocation } from 'react-router'
import BlogPostPage from '../../src/pages/BlogPostPage'

export default function BlogPost() {
  const { pathname } = useLocation()
  return <BlogPostPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
