import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  lang: 'es' | 'en'
  path?: string
  ogImage?: string
}

const SITE_URL = import.meta.env.VITE_SITE_URL as string
const BRAND_NAME = import.meta.env.VITE_BRAND_NAME as string

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

export function useSEO({ title, description, lang, path = '', ogImage }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${BRAND_NAME}`
    const canonical = `${SITE_URL}${path}`
    const altLang = lang === 'es' ? 'en' : 'es'
    const altPath = lang === 'es' ? `/en${path}` : path.replace(/^\/en/, '')

    document.title = fullTitle
    document.documentElement.lang = lang

    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', canonical)
    setMeta('meta[property="og:locale"]', 'content', lang === 'es' ? 'es_CR' : 'en_US')
    if (ogImage) setMeta('meta[property="og:image"]', 'content', ogImage)

    setLink('canonical', { href: canonical })
    setLink('alternate', { hreflang: lang, href: canonical })

    // Alternate language link
    let altEl = document.querySelector<HTMLLinkElement>(`link[hreflang="${altLang}"]`)
    if (!altEl) {
      altEl = document.createElement('link')
      altEl.rel = 'alternate'
      altEl.setAttribute('hreflang', altLang)
      document.head.appendChild(altEl)
    }
    altEl.href = `${SITE_URL}${altPath}`

    // x-default
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
      '@type': 'SurfSchool',
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
  }, [title, description, lang, path, ogImage])
}
