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

const DYNAMIC_PATTERNS: { es: RegExp; en: string }[] = [
  { es: /^\/instructores\/(.+)$/, en: '/en/instructors/$1' },
  { es: /^\/confirmar-reserva\/(.+)$/, en: '/en/confirm-booking/$1' },
]

const DYNAMIC_PATTERNS_EN: { en: RegExp; es: string }[] = [
  { en: /^\/en\/instructors\/(.+)$/, es: '/instructores/$1' },
  { en: /^\/en\/confirm-booking\/(.+)$/, es: '/confirmar-reserva/$1' },
]

export default function LanguageSwitcher() {
  const { setLang } = useLanguageStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const currentLang = isEn ? 'en' : 'es'

  function toggle() {
    const mapped = ROUTE_MAP[pathname]
    let targetPath: string | undefined

    if (mapped) {
      targetPath = mapped
    } else if (currentLang === 'es') {
      for (const { es, en } of DYNAMIC_PATTERNS) {
        const match = pathname.match(es)
        if (match) { targetPath = en.replace('$1', match[1]); break }
      }
      if (!targetPath) targetPath = '/en'
    } else {
      for (const { en, es } of DYNAMIC_PATTERNS_EN) {
        const match = pathname.match(en)
        if (match) { targetPath = es.replace('$1', match[1]); break }
      }
      if (!targetPath) targetPath = '/'
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
