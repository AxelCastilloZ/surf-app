import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  lang: 'es' | 'en'
  path?: string
  ogImage?: string
  noindex?: boolean
}

const SITE_URL = (import.meta.env.VITE_SITE_URL as string).replace(/\/$/, '')
const BRAND_NAME = import.meta.env.VITE_BRAND_NAME as string
const DEFAULT_OG_IMAGE = `${SITE_URL}/api/og-image`

const ES_TO_EN: Record<string, string> = {
  '/': '/en',
  '/galeria': '/en/gallery',
  '/reservar': '/en/book',
  '/politicas': '/en/policies',
}

const EN_TO_ES: Record<string, string> = {
  '/en': '/',
  '/en/gallery': '/galeria',
  '/en/book': '/reservar',
  '/en/policies': '/politicas',
}

function toAlternatePath(path: string, fromLang: 'es' | 'en'): string {
  if (fromLang === 'es') {
    const mapped = ES_TO_EN[path]
    if (mapped) return mapped
    return path.replace(/^\/instructores\//, '/en/instructors/')
               .replace(/^\/confirmar-reserva\//, '/en/confirm-booking/')
  }
  const mapped = EN_TO_ES[path]
  if (mapped) return mapped
  return path.replace(/^\/en\/instructors\//, '/instructores/')
             .replace(/^\/en\/confirm-booking\//, '/confirmar-reserva/')
}

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    const [attrName, attrValue] = selector.replace('meta[', '').replace(']', '').split('="')
    el.setAttribute(attrName, attrValue?.replace('"', '') ?? '')
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

function setLink(rel: string, attrs: Record<string, string>) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v))
}

export function useSEO({ title, description, lang, path = '', ogImage, noindex }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${BRAND_NAME}`
    const canonical = `${SITE_URL}${path}`
    const altLang = lang === 'es' ? 'en' : 'es'
    const altPath = toAlternatePath(path, lang)
    const image = ogImage || DEFAULT_OG_IMAGE

    document.title = fullTitle
    document.documentElement.lang = lang

    setMeta('meta[name="description"]', 'content', description)
    if (noindex) {
      setMeta('meta[name="robots"]', 'content', 'noindex, nofollow')
    }

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', canonical)
    setMeta('meta[property="og:locale"]', 'content', lang === 'es' ? 'es_CR' : 'en_US')
    setMeta('meta[property="og:type"]', 'content', 'website')
    setMeta('meta[property="og:site_name"]', 'content', BRAND_NAME)
    setMeta('meta[property="og:image"]', 'content', image)

    // Twitter Card
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', description)
    setMeta('meta[name="twitter:image"]', 'content', image)

    setLink('canonical', { href: canonical })
    setLink('alternate', { hreflang: lang, href: canonical })

    let altEl = document.querySelector<HTMLLinkElement>(`link[hreflang="${altLang}"]`)
    if (!altEl) {
      altEl = document.createElement('link')
      altEl.rel = 'alternate'
      altEl.setAttribute('hreflang', altLang)
      document.head.appendChild(altEl)
    }
    altEl.href = `${SITE_URL}${altPath}`

    let xDefault = document.querySelector<HTMLLinkElement>('link[hreflang="x-default"]')
    if (!xDefault) {
      xDefault = document.createElement('link')
      xDefault.rel = 'alternate'
      xDefault.setAttribute('hreflang', 'x-default')
      document.head.appendChild(xDefault)
    }
    xDefault.href = `${SITE_URL}/`

    // JSON-LD LocalBusiness
    const existingLd = document.querySelector('script[type="application/ld+json"]')
    if (existingLd) existingLd.remove()
    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SportsActivityLocation',
      '@id': SITE_URL,
      name: BRAND_NAME,
      url: SITE_URL,
      description,
      inLanguage: lang,
      telephone: '+506-8397-2306',
      email: 'info@surferlabscr.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Playa Guiones',
        addressLocality: 'Nosara',
        addressRegion: 'Guanacaste',
        addressCountry: 'CR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 9.9416,
        longitude: -85.6609,
      },
      areaServed: [
        { '@type': 'Place', name: 'Nosara' },
        { '@type': 'Place', name: 'Guanacaste' },
        { '@type': 'Place', name: 'Costa Rica' },
      ],
      makesOffer: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Surf Lessons' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Video Analysis' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Surf Trips' } },
      ],
      image: `${SITE_URL}/assets/icons/logo4k.png`,
      priceRange: '$$',
    })
    document.head.appendChild(ld)
  }, [title, description, lang, path, ogImage, noindex])
}
