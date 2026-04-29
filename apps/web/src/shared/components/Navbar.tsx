import { Link, useLocation } from 'react-router-dom'
import { useLanguageStore } from '../store/languageStore'
import LanguageSwitcher from './LanguageSwitcher'

const links = {
  es: [
    { label: 'Inicio', href: '/' },
    { label: 'Galería', href: '/galeria' },
    { label: 'Políticas', href: '/politicas' },
  ],
  en: [
    { label: 'Home', href: '/en' },
    { label: 'Gallery', href: '/en/gallery' },
    { label: 'Policies', href: '/en/policies' },
  ],
}

export default function Navbar() {
  const { lang } = useLanguageStore()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-ocean-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to={lang === 'es' ? '/' : '/en'} className="font-display text-xl font-bold text-white">
          {import.meta.env.VITE_BRAND_NAME}
        </Link>

        <ul className="hidden gap-6 md:flex">
          {links[lang].map(({ label, href }) => (
            <li key={href}>
              <Link
                to={href}
                className={`text-sm font-medium transition-colors hover:text-ocean-300 ${
                  location.pathname === href ? 'text-ocean-300' : 'text-white/80'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <LanguageSwitcher />
      </nav>
    </header>
  )
}
