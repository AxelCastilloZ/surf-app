import { Link } from 'react-router-dom'
import { useLanguageStore } from '../store/languageStore'

export default function Footer() {
  const { lang } = useLanguageStore()
  const year = new Date().getFullYear()

  const policiesHref = lang === 'es' ? '/politicas' : '/en/policies'
  const policiesLabel = lang === 'es' ? 'Políticas' : 'Policies'

  return (
    <footer className="border-t border-ocean-900 bg-ocean-950 py-8 text-white/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-sm sm:flex-row sm:justify-between">
        <p>
          © {year} {import.meta.env.VITE_BRAND_NAME}. Todos los derechos reservados.
        </p>
        <Link to={policiesHref} className="hover:text-white transition-colors">
          {policiesLabel}
        </Link>
      </div>
    </footer>
  )
}
