const SITE_URL = 'https://surferlabscr.com'
const BRAND_NAME = 'Surfers Lab CR'
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/icons/logo4k.png`

const ES_TO_EN: Record<string, string> = {
  '/': '/en',
  '/galeria': '/en/gallery',
  '/reservar': '/en/book',
  '/politicas': '/en/policies',
  '/preguntas-frecuentes': '/en/faq',
  '/blog': '/en/blog',
}

const EN_TO_ES: Record<string, string> = {
  '/en': '/',
  '/en/gallery': '/galeria',
  '/en/book': '/reservar',
  '/en/policies': '/politicas',
  '/en/faq': '/preguntas-frecuentes',
  '/en/blog': '/blog',
}

function toAlternatePath(path: string, fromLang: 'es' | 'en'): string {
  if (fromLang === 'es') {
    const mapped = ES_TO_EN[path]
    if (mapped) return mapped
    return path
      .replace(/^\/blog\//, '/en/blog/')
      .replace(/^\/instructores\//, '/en/instructors/')
  }
  const mapped = EN_TO_ES[path]
  if (mapped) return mapped
  return path
    .replace(/^\/en\/blog\//, '/blog/')
    .replace(/^\/en\/instructors\//, '/instructores/')
}

type MetaEntry =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { tagName: 'link'; rel: string; href: string; hreflang?: string }
  | { 'script:ld+json': Record<string, unknown> }

interface BuildMetaOpts {
  title: string
  description: string
  lang: 'es' | 'en'
  path: string
  noindex?: boolean
  ogImage?: string
  schemas?: Record<string, unknown>[]
}

export function buildRouteMeta({
  title,
  description,
  lang,
  path,
  noindex,
  ogImage,
  schemas,
}: BuildMetaOpts): MetaEntry[] {
  const fullTitle = `${title} | ${BRAND_NAME}`
  const canonical = `${SITE_URL}${path}`
  const altLang = lang === 'es' ? 'en' : 'es'
  const altPath = toAlternatePath(path, lang)
  const image = ogImage || DEFAULT_OG_IMAGE
  const xDefaultHref = lang === 'en' ? canonical : `${SITE_URL}${altPath}`

  const entries: MetaEntry[] = [
    { title: fullTitle },
    { name: 'description', content: description },

    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical },
    { property: 'og:locale', content: lang === 'es' ? 'es_CR' : 'en_US' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: BRAND_NAME },
    { property: 'og:image', content: image },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },

    { tagName: 'link', rel: 'canonical', href: canonical },
    { tagName: 'link', rel: 'alternate', href: canonical, hreflang: lang },
    { tagName: 'link', rel: 'alternate', href: `${SITE_URL}${altPath}`, hreflang: altLang },
    { tagName: 'link', rel: 'alternate', href: xDefaultHref, hreflang: 'x-default' },
  ]

  if (noindex) {
    entries.push({ name: 'robots', content: 'noindex, nofollow' })
  }

  if (schemas) {
    for (const schema of schemas) {
      entries.push({ 'script:ld+json': schema })
    }
  }

  return entries
}

export function buildLocalBusinessSchema(
  description: string,
  lang: 'es' | 'en',
  extra?: Record<string, unknown>,
): Record<string, unknown> {
  return {
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
    keywords:
      'surf lessons Nosara, surf school Guiones, Costa Rica surf, Playa Guiones surf, learn to surf Nosara, escuela de surf Nosara, clases de surf Guanacaste',
    sameAs: [
      'https://www.instagram.com/surferslab',
      'https://www.facebook.com/SurfersLab',
    ],
    ...extra,
  }
}

export function buildBreadcrumbs(
  path: string,
  lang: 'es' | 'en',
  pageTitle: string,
): Record<string, unknown> {
  const homeName = lang === 'es' ? 'Inicio' : 'Home'
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeName,
        item: `${SITE_URL}${lang === 'es' ? '/' : '/en'}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageTitle,
        item: `${SITE_URL}${path}`,
      },
    ],
  }
}

export function getLang(pathname: string): 'es' | 'en' {
  return pathname.startsWith('/en') ? 'en' : 'es'
}
