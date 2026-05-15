import { Link } from 'react-router-dom'
import { useLanguageStore } from '../shared/store/languageStore'
import Navbar from '../shared/components/Navbar'

export default function NotFoundPage() {
  const { lang } = useLanguageStore()
  const homeHref = lang === 'es' ? '/' : '/en'

  return (
    <div className="min-h-screen bg-white font-body text-slate-900">
      <Navbar />
      <div className="flex flex-col items-center justify-center gap-6 px-6 py-32 text-center">
        <p className="font-display text-9xl font-bold text-ocean-500">404</p>
        <h1 className="font-display text-3xl font-bold text-slate-900">
          {lang === 'es' ? 'Página no encontrada' : 'Page not found'}
        </h1>
        <p className="max-w-sm text-slate-600">
          {lang === 'es'
            ? 'La página que buscas no existe o fue movida.'
            : "The page you're looking for doesn't exist or has been moved."}
        </p>
        <Link
          to={homeHref}
          className="mt-4 rounded-full bg-coral-500 px-8 py-3 font-semibold text-white transition hover:bg-coral-600"
        >
          {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
        </Link>
      </div>
    </div>
  )
}
