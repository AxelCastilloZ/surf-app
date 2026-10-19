import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = 'https://surferlabscr.com'

interface Instructor {
  id: string
  full_name: string
}

const STATIC_ROUTES = [
  { es: '/', en: '/en', changefreq: 'weekly', priority: '1.0' },
  { es: '/galeria', en: '/en/gallery', changefreq: 'weekly', priority: '0.8' },
  { es: '/reservar', en: '/en/book', changefreq: 'monthly', priority: '0.9' },
  { es: '/politicas', en: '/en/policies', changefreq: 'yearly', priority: '0.3' },
]

function buildUrlEntry(esPath: string, enPath: string, changefreq: string, priority: string): string {
  const esUrl = `${SITE_URL}${esPath}`
  const enUrl = `${SITE_URL}${enPath}`
  const xDefault = esUrl

  return `  <url>
    <loc>${esUrl}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefault}"/>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefault}"/>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''

    let instructors: Instructor[] = []

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { data } = await supabase
        .from('instructors')
        .select('id, full_name')
        .eq('is_active', true)
        .order('full_name', { ascending: true })

      instructors = (data ?? []) as Instructor[]
    }

    const staticEntries = STATIC_ROUTES.map(r => buildUrlEntry(r.es, r.en, r.changefreq, r.priority))

    const instructorEntries = instructors.map(i =>
      buildUrlEntry(`/instructores/${i.id}`, `/en/instructors/${i.id}`, 'monthly', '0.7'),
    )

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticEntries, ...instructorEntries].join('\n')}
</urlset>`

    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60')
    res.status(200).send(xml)
  } catch {
    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, s-maxage=60')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${STATIC_ROUTES.map(r => buildUrlEntry(r.es, r.en, r.changefreq, r.priority)).join('\n')}
</urlset>`

    res.status(200).send(xml)
  }
}
