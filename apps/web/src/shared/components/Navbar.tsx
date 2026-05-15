import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useLanguageStore } from '../store/languageStore'
import LanguageSwitcher from './LanguageSwitcher'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'

const links = {
  es: [
    { label: 'Inicio', href: '/' },
    { label: 'Galería', href: '/galeria' },
  ],
  en: [
    { label: 'Home', href: '/en' },
    { label: 'Gallery', href: '/en/gallery' },
  ],
}

export default function Navbar() {
  const { lang } = useLanguageStore()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const navLinks = links[lang]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo — scroll suave al top */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="flex items-center cursor-pointer"
          aria-label="Surfers Lab CR - Volver al inicio"
        >
          <img
            src="/assets/icons/logo4k.png"
            alt="Surfers Lab CR"
            className="h-8 w-auto object-contain"
            style={{ filter: 'invert(1) sepia(1) saturate(3) hue-rotate(170deg)' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const fallback = e.currentTarget.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'block'
            }}
          />
          <span style={{ display: 'none' }} className="font-display text-xl font-bold text-ocean-700 tracking-tight">
            Surfers Lab CR
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden gap-6 md:flex">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                to={href}
                className={`text-sm font-medium transition-colors hover:text-ocean-600 ${
                  location.pathname === href ? 'text-ocean-600' : 'text-slate-600'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop: idioma */}
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>

        {/* Mobile: hamburguesa + Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="flex items-center justify-center rounded-md p-2 text-slate-600 transition-colors hover:bg-mist-100 hover:text-ocean-600 md:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-72 border-l border-slate-200 bg-white p-0"
          >
            {/* Header del Sheet */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <span className="font-display text-lg font-semibold text-ocean-700">
                Surfers Lab CR
              </span>
            </div>

            {/* Links de navegación */}
            <nav className="flex flex-col gap-1 px-4 py-6">
              {navLinks.map(({ label, href }) => (
                <SheetClose asChild key={href}>
                  <Link
                    to={href}
                    className={`rounded-lg px-4 py-3 text-lg font-medium transition-colors hover:bg-mist-100 hover:text-ocean-600 ${
                      location.pathname === href
                        ? 'bg-ocean-100 text-ocean-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {label}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            {/* Footer del Sheet: idioma */}
            <div className="border-t border-slate-100 px-6 py-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                {lang === 'es' ? 'Idioma' : 'Language'}
              </p>
              <LanguageSwitcher />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
