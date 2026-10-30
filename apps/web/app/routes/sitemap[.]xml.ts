import { createSupabaseClient } from '@surf-app/supabase'

const SITE_URL = 'https://surferlabscr.com'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const STATIC_ROUTES = [
  { es: '/', en: '/en', changefreq: 'weekly', priority: '1.0' },
  { es: '/galeria', en: '/en/gallery', changefreq: 'weekly', priority: '0.8' },
  { es: '/reservar', en: '/en/book', changefreq: 'monthly', priority: '0.9' },
  { es: '/politicas', en: '/en/policies', changefreq: 'yearly', priority: '0.3' },
  { es: '/preguntas-frecuentes', en: '/en/faq', changefreq: 'monthly', priority: '0.6' },
  { es: '/blog', en: '/en/blog', changefreq: 'weekly', priority: '0.7' },
]

function buildUrlEntry(esPath: string, enPath: string, changefreq: string, priority: string): string {
  const esUrl = `${SITE_URL}${esPath}`
  const enUrl = `${SITE_URL}${enPath}`

  return `  <url>
    <loc>${esUrl}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esUrl}"/>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esUrl}"/>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

export async function loader() {
  const staticEntries = STATIC_ROUTES.map(r => buildUrlEntry(r.es, r.en, r.changefreq, r.priority))

  let instructorEntries: string[] = []
  let blogEntries: string[] = []

  try {
    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

    const [instructorsRes, blogRes] = await Promise.all([
      supabase
        .from('instructors')
        .select('id')
        .eq('is_active', true)
        .order('full_name', { ascending: true }),
      supabase
        .from('blog_posts')
        .select('slug')
        .eq('is_published', true)
        .order('published_at', { ascending: false }),
    ])

    instructorEntries = (instructorsRes.data ?? []).map((i: { id: string }) =>
      buildUrlEntry(`/instructores/${i.id}`, `/en/instructors/${i.id}`, 'monthly', '0.7'),
    )

    blogEntries = (blogRes.data ?? []).map((p: { slug: string }) =>
      buildUrlEntry(`/blog/${p.slug}`, `/en/blog/${p.slug}`, 'monthly', '0.7'),
    )
  } catch {
    // Fall back to static-only sitemap
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticEntries, ...instructorEntries, ...blogEntries].join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  })
}
