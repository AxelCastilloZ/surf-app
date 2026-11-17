import { Link, useLocation } from 'react-router'

export default function Footer() {
  const { pathname } = useLocation()
  // Language is derived from the URL (not the client store) so that SSR/Googlebot
  // render links in the correct language on every page. See seo.ts getLang().
  const lang: 'es' | 'en' = pathname.startsWith('/en') ? 'en' : 'es'
  const year = new Date().getFullYear()

  const policiesHref = lang === 'es' ? '/politicas' : '/en/policies'
  const policiesLabel = lang === 'es' ? 'Políticas' : 'Policies'
  const faqHref = lang === 'es' ? '/preguntas-frecuentes' : '/en/faq'
  const faqLabel = lang === 'es' ? 'Preguntas Frecuentes' : 'FAQ'
  const blogHref = lang === 'es' ? '/blog' : '/en/blog'
  const reviewLabel = lang === 'es' ? 'Déjanos tu reseña' : 'Leave us a review'

  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-sm text-slate-400 sm:flex-row sm:justify-between">
        <p>
          © {year} {import.meta.env.VITE_BRAND_NAME}.{' '}
          {lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
        </p>
        <div className="flex gap-4">
          <Link to={faqHref} className="transition-colors hover:text-white">
            {faqLabel}
          </Link>
          <Link to={blogHref} className="transition-colors hover:text-white">
            Blog
          </Link>
          <Link to={policiesHref} className="transition-colors hover:text-white">
            {policiesLabel}
          </Link>
          <a
            href="https://search.google.com/local/writereview?placeid=ChIJ-VT2s-VVno8R-5RMA8j1qdI"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            {reviewLabel}
          </a>
        </div>
      </div>
    </footer>
  )
}
