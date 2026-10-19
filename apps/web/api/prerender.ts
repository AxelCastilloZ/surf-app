import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = 'https://surferlabscr.com'
const BRAND = 'Surfers Lab CR'
const OG_IMAGE = `${SITE_URL}/assets/icons/logo4k.png`

interface PageMeta {
  title: string
  description: string
  locale: string
}

const ROUTE_META: Record<string, PageMeta> = {
  '/': {
    title: `Clases de Surf en Nosara, Guanacaste — Costa Rica | ${BRAND}`,
    description: 'Escuela de surf en Playa Guiones, Nosara. Clases con instructores certificados, video análisis y surf trips en Guanacaste, Costa Rica.',
    locale: 'es_CR',
  },
  '/en': {
    title: `Surf Lessons in Nosara, Guanacaste — Costa Rica | ${BRAND}`,
    description: 'Surf school at Playa Guiones, Nosara. Certified instructors, video analysis and surf trips in Guanacaste, Costa Rica.',
    locale: 'en_US',
  },
  '/galeria': {
    title: `Galería | ${BRAND}`,
    description: 'Galería de fotos y videos de clases de surf, trips y video análisis en Nosara, Guanacaste, Costa Rica.',
    locale: 'es_CR',
  },
  '/en/gallery': {
    title: `Gallery | ${BRAND}`,
    description: 'Gallery of photos and videos from surf lessons, trips and video analysis in Nosara, Guanacaste, Costa Rica.',
    locale: 'en_US',
  },
  '/reservar': {
    title: `Reservar | ${BRAND}`,
    description: 'Reserva tu clase de surf en Nosara, Guanacaste, Costa Rica.',
    locale: 'es_CR',
  },
  '/en/book': {
    title: `Book Now | ${BRAND}`,
    description: 'Book your surf lesson in Nosara, Guanacaste, Costa Rica.',
    locale: 'en_US',
  },
  '/politicas': {
    title: `Políticas | ${BRAND}`,
    description: 'Políticas de cancelación y privacidad de Surfers Lab CR, escuela de surf en Nosara, Guanacaste.',
    locale: 'es_CR',
  },
  '/en/policies': {
    title: `Policies | ${BRAND}`,
    description: 'Cancellation and privacy policies for Surfers Lab CR, surf school in Nosara, Guanacaste.',
    locale: 'en_US',
  },
  '/preguntas-frecuentes': {
    title: `Preguntas Frecuentes | ${BRAND}`,
    description: 'Preguntas frecuentes sobre clases de surf, reservas, políticas y más en Surfers Lab CR, Nosara, Costa Rica.',
    locale: 'es_CR',
  },
  '/en/faq': {
    title: `FAQ | ${BRAND}`,
    description: 'Frequently asked questions about surf lessons, bookings, policies and more at Surfers Lab CR, Nosara, Costa Rica.',
    locale: 'en_US',
  },
}

const FAQ_DATA: Record<'es' | 'en', { q: string; a: string }[]> = {
  es: [
    { q: '¿Cómo reservo una clase de surf?', a: 'Puedes reservar directamente desde nuestro sitio web en la sección "Reservar". Selecciona el tipo de servicio, la fecha, el número de participantes y completa tus datos. Recibirás un correo de confirmación con todos los detalles.' },
    { q: '¿Cuál es la política de cancelación?', a: 'Las cancelaciones con más de 24 horas de anticipación reciben reembolso completo. Con menos de 24 horas no hay reembolso. En caso de mal clima, ofrecemos reprogramación sin costo.' },
    { q: '¿Qué debo llevar a mi clase de surf?', a: 'Solo necesitas traer protector solar biodegradable, traje de baño y una toalla. Nosotros proporcionamos la tabla de surf, el rash guard y todo el equipo necesario.' },
    { q: '¿Necesito experiencia previa para tomar clases?', a: 'No, nuestras clases están diseñadas para todos los niveles, desde principiantes absolutos hasta surfistas intermedios que quieren mejorar su técnica. Nuestros instructores adaptan la clase a tu nivel.' },
    { q: '¿Cuánto dura una clase de surf?', a: 'Las clases grupales y privadas tienen una duración aproximada de 1.5 a 2 horas, incluyendo calentamiento en tierra, instrucción en el agua y práctica libre.' },
    { q: '¿Dónde se ubica la escuela de surf?', a: 'Estamos en Playa Guiones, Nosara, Guanacaste, Costa Rica. Playa Guiones es reconocida mundialmente como una de las mejores playas para aprender surf por sus olas consistentes y fondo de arena.' },
    { q: '¿Cuál es el tamaño máximo de los grupos?', a: 'Mantenemos grupos pequeños con un máximo de 4-6 estudiantes por instructor para garantizar atención personalizada y seguridad en el agua.' },
    { q: '¿Los instructores están certificados?', a: 'Sí, todos nuestros instructores son surfistas experimentados con certificación ISA (International Surfing Association) y entrenamiento en primeros auxilios y rescate acuático.' },
  ],
  en: [
    { q: 'How do I book a surf lesson?', a: 'You can book directly from our website in the "Book" section. Select the type of service, date, number of participants, and fill in your details. You will receive a confirmation email with all the details.' },
    { q: 'What is the cancellation policy?', a: 'Cancellations made more than 24 hours in advance receive a full refund. Less than 24 hours, no refund is available. In case of bad weather, we offer free rescheduling.' },
    { q: 'What should I bring to my surf lesson?', a: 'Just bring biodegradable sunscreen, a swimsuit, and a towel. We provide the surfboard, rash guard, and all necessary equipment.' },
    { q: 'Do I need previous experience to take lessons?', a: 'No, our lessons are designed for all levels, from absolute beginners to intermediate surfers looking to improve their technique. Our instructors adapt the lesson to your level.' },
    { q: 'How long is a surf lesson?', a: 'Group and private lessons last approximately 1.5 to 2 hours, including warm-up on land, instruction in the water, and free practice.' },
    { q: 'Where is the surf school located?', a: 'We are located at Playa Guiones, Nosara, Guanacaste, Costa Rica. Playa Guiones is world-renowned as one of the best beaches to learn surfing due to its consistent waves and sandy bottom.' },
    { q: 'What is the maximum group size?', a: 'We keep groups small with a maximum of 4-6 students per instructor to ensure personalized attention and safety in the water.' },
    { q: 'Are the instructors certified?', a: 'Yes, all our instructors are experienced surfers with ISA (International Surfing Association) certification and training in first aid and water rescue.' },
  ],
}

const BREADCRUMB_TITLES: Record<string, { title: string; lang: 'es' | 'en' }> = {
  '/galeria': { title: 'Galería', lang: 'es' },
  '/en/gallery': { title: 'Gallery', lang: 'en' },
  '/reservar': { title: 'Reservar', lang: 'es' },
  '/en/book': { title: 'Book Now', lang: 'en' },
  '/politicas': { title: 'Políticas', lang: 'es' },
  '/en/policies': { title: 'Policies', lang: 'en' },
  '/preguntas-frecuentes': { title: 'Preguntas Frecuentes', lang: 'es' },
  '/en/faq': { title: 'FAQ', lang: 'en' },
}

function buildLocalBusinessSchema(description: string, lang: 'es' | 'en'): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    '@id': SITE_URL,
    name: BRAND,
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
    geo: { '@type': 'GeoCoordinates', latitude: 9.9416, longitude: -85.6609 },
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
  }
}

function buildBreadcrumbs(path: string, lang: 'es' | 'en', pageTitle: string): Record<string, unknown> {
  const homeName = lang === 'es' ? 'Inicio' : 'Home'
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: `${SITE_URL}${lang === 'es' ? '/' : '/en'}` },
      { '@type': 'ListItem', position: 2, name: pageTitle, item: `${SITE_URL}${path}` },
    ],
  }
}

function buildFaqSchema(lang: 'es' | 'en'): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA[lang].map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

function buildPersonSchema(name: string, lang: 'es' | 'en'): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: lang === 'es' ? 'Instructor de Surf' : 'Surf Instructor',
    worksFor: { '@type': 'SportsActivityLocation', name: BRAND },
  }
}

function getSchemasForPath(path: string): Record<string, unknown>[] {
  if (path === '/' || path === '/en') {
    const lang = path === '/' ? 'es' : 'en'
    const meta = ROUTE_META[path]
    return [buildLocalBusinessSchema(meta.description, lang)]
  }

  const breadcrumbInfo = BREADCRUMB_TITLES[path]
  if (!breadcrumbInfo) return []

  const schemas: Record<string, unknown>[] = [buildBreadcrumbs(path, breadcrumbInfo.lang, breadcrumbInfo.title)]

  if (path === '/preguntas-frecuentes') schemas.push(buildFaqSchema('es'))
  if (path === '/en/faq') schemas.push(buildFaqSchema('en'))

  return schemas
}

function buildHtml(meta: PageMeta, canonical: string, schemas: Record<string, unknown>[] = []): string {
  const schemaScripts = schemas
    .map((s) => `  <script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n')

  return `<!DOCTYPE html>
<html lang="${meta.locale.startsWith('es') ? 'es' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${BRAND}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:locale" content="${meta.locale}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
${schemaScripts}
</head>
<body><p>${meta.description}</p></body>
</html>`
}

async function getInstructorMeta(id: string, lang: 'es' | 'en'): Promise<{ meta: PageMeta; schemas: Record<string, unknown>[] } | null> {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null

  const supabase = createClient(url, key)
  const { data } = await supabase
    .from('instructors')
    .select('full_name, bio')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!data) return null

  const suffix = lang === 'es'
    ? ' — Instructor de surf en Nosara, Costa Rica'
    : ' — Surf instructor in Nosara, Costa Rica'

  const path = lang === 'es' ? `/instructores/${id}` : `/en/instructors/${id}`

  return {
    meta: {
      title: `${data.full_name} | ${BRAND}`,
      description: ((data.bio ?? '') + suffix).slice(0, 160),
      locale: lang === 'es' ? 'es_CR' : 'en_US',
    },
    schemas: [
      buildBreadcrumbs(path, lang, data.full_name),
      buildPersonSchema(data.full_name, lang),
    ],
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = '/' + ((req.query.path as string) ?? '').trim().replace(/^\//, '')

  // Static routes
  const staticMeta = ROUTE_META[path]
  if (staticMeta) {
    const schemas = getSchemasForPath(path)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).send(buildHtml(staticMeta, `${SITE_URL}${path}`, schemas))
  }

  // Dynamic: instructor profiles
  const esMatch = path.match(/^\/instructores\/(.+)$/)
  const enMatch = path.match(/^\/en\/instructors\/(.+)$/)
  const instructorId = esMatch?.[1] ?? enMatch?.[1]
  const lang = enMatch ? 'en' : 'es'

  if (instructorId) {
    const result = await getInstructorMeta(instructorId, lang as 'es' | 'en')
    if (result) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
      return res.status(200).send(buildHtml(result.meta, `${SITE_URL}${path}`, result.schemas))
    }
  }

  // Fallback to home meta
  const fallback = ROUTE_META['/']
  const fallbackSchemas = getSchemasForPath('/')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.status(200).send(buildHtml(fallback, `${SITE_URL}${path}`, fallbackSchemas))
}
