import { Link } from 'react-router-dom'
import { useLanguageStore } from '../shared/store/languageStore'

export default function NotFoundPage() {
  const { lang } = useLanguageStore()
  const homeHref = lang === 'es' ? '/' : '/en'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ocean-950 px-6 text-center font-body">
      <p className="font-display text-8xl font-bold text-ocean-700">404</p>
      <h1 className="font-display text-3xl font-bold text-white">
        {lang === 'es' ? 'Página no encontrada' : 'Page not found'}
      </h1>
      <p className="max-w-sm text-ocean-300">
        {lang === 'es'
          ? 'La página que buscas no existe o fue movida.'
          : "The page you're looking for doesn't exist or has been moved."}
      </p>
      <Link
        to={homeHref}
        className="mt-4 rounded-full bg-ocean-600 px-8 py-3 font-semibold text-white transition hover:bg-ocean-500"
      >
        {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
      </Link>
    </div>
  )
}
