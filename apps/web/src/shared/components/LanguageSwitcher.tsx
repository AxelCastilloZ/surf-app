import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguageStore } from '../store/languageStore'

const ROUTE_MAP: Record<string, string> = {
  '/': '/en',
  '/galeria': '/en/gallery',
  '/reservar': '/en/book',
  '/politicas': '/en/policies',
  '/en': '/',
  '/en/gallery': '/galeria',
  '/en/book': '/reservar',
  '/en/policies': '/politicas',
}

export default function LanguageSwitcher() {
  const { setLang } = useLanguageStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const currentLang = isEn ? 'en' : 'es'

  function toggle() {
    const mapped = ROUTE_MAP[pathname]
    let targetPath: string

    if (mapped) {
      targetPath = mapped
    } else if (currentLang === 'es') {
      targetPath = `/en${pathname}`
    } else {
      targetPath = pathname.replace(/^\/en\//, '/').replace(/^\/en$/, '/') || '/'
    }

    const newLang = currentLang === 'es' ? 'en' : 'es'
    setLang(newLang)
    navigate(targetPath)
  }

  return (
    <button
      onClick={toggle}
      className="rounded-md border border-slate-300 px-3 py-1 text-sm font-medium text-slate-600 transition-colors hover:border-ocean-500 hover:text-ocean-600"
      aria-label="Switch language"
    >
      {currentLang === 'es' ? 'EN' : 'ES'}
    </button>
  )
}
