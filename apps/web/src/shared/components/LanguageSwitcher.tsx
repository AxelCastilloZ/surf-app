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
      className="rounded-md border border-slate-300 px-3 py-1 text-sm font-medium text-slate-600 transition-colors hover:border-ocean-500 hover:text-ocean-600"
      aria-label="Switch language"
    >
      {lang === 'es' ? 'EN' : 'ES'}
    </button>
  )
}
