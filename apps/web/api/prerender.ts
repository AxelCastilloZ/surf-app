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
}

function buildHtml(meta: PageMeta, canonical: string): string {
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
</head>
<body><p>${meta.description}</p></body>
</html>`
}

async function getInstructorMeta(id: string, lang: 'es' | 'en'): Promise<PageMeta | null> {
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

  return {
    title: `${data.full_name} | ${BRAND}`,
    description: ((data.bio ?? '') + suffix).slice(0, 160),
    locale: lang === 'es' ? 'es_CR' : 'en_US',
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = '/' + ((req.query.path as string) ?? '').trim().replace(/^\//, '')

  // Static routes
  const staticMeta = ROUTE_META[path]
  if (staticMeta) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).send(buildHtml(staticMeta, `${SITE_URL}${path}`))
  }

  // Dynamic: instructor profiles
  const esMatch = path.match(/^\/instructores\/(.+)$/)
  const enMatch = path.match(/^\/en\/instructors\/(.+)$/)
  const instructorId = esMatch?.[1] ?? enMatch?.[1]
  const lang = enMatch ? 'en' : 'es'

  if (instructorId) {
    const meta = await getInstructorMeta(instructorId, lang as 'es' | 'en')
    if (meta) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
      return res.status(200).send(buildHtml(meta, `${SITE_URL}${path}`))
    }
  }

  // Fallback to home meta
  const fallback = ROUTE_META['/']
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.status(200).send(buildHtml(fallback, `${SITE_URL}${path}`))
}
