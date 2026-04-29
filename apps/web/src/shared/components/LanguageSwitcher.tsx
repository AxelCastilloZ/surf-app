import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguageStore } from '../store/languageStore'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguageStore()
  const navigate = useNavigate()
  const location = useLocation()

  function toggle() {
    if (lang === 'es') {
      setLang('en')
      const enPath = location.pathname === '/' ? '/en' : `/en${location.pathname}`
      navigate(enPath)
    } else {
      setLang('es')
      const esPath = location.pathname.replace(/^\/en/, '') || '/'
      navigate(esPath)
    }
  }

  return (
    <button
      onClick={toggle}
      className="rounded-md border border-white/20 px-3 py-1 text-sm font-medium text-white/80 transition-colors hover:border-white/50 hover:text-white"
      aria-label="Switch language"
    >
      {lang === 'es' ? 'EN' : 'ES'}
    </button>
  )
}
