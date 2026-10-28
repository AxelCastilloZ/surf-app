import { useLocation } from 'react-router'
import BlogListPage from '../../src/pages/BlogListPage'

export default function BlogList() {
  const { pathname } = useLocation()
  return <BlogListPage lang={pathname.startsWith('/en') ? 'en' : 'es'} />
}
