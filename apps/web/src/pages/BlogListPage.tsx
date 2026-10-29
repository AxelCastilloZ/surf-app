import { Link } from 'react-router'
import { useInView } from 'react-intersection-observer'
import { useSEO, buildBreadcrumbs } from '../shared/hooks/useSEO'
import { useBlogPosts, type BlogPost } from '../shared/hooks/useBlog'
import Navbar from '../shared/components/Navbar'
import Footer from '../shared/components/Footer'

type Lang = 'es' | 'en'

const i18n = {
  es: {
    title: 'Blog',
    seoTitle: 'Blog — Surf en Nosara, Costa Rica',
    description: 'Artículos sobre surf en Nosara, Playa Guiones y Costa Rica. Guías para principiantes, mejores épocas para surfear, tips y más.',
    empty: 'Próximamente — estamos preparando contenido para ti.',
    readMore: 'Leer más',
  },
  en: {
    title: 'Blog',
    seoTitle: 'Blog — Surfing in Nosara, Costa Rica',
    description: 'Articles about surfing in Nosara, Playa Guiones and Costa Rica. Beginner guides, best times to surf, tips and more.',
    empty: 'Coming soon — we are preparing content for you.',
    readMore: 'Read more',
  },
}

function formatDate(dateStr: string, lang: Lang): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(lang === 'es' ? 'es-CR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function BlogCard({ post, lang }: { post: BlogPost; lang: Lang }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const t = i18n[lang]
  const title = lang === 'en' ? post.title_en : post.title
  const excerpt = lang === 'en' ? post.excerpt_en : post.excerpt
  const coverAlt = lang === 'en' ? post.cover_image_alt_en || post.cover_image_alt : post.cover_image_alt
  const slug = post.slug
  const href = lang === 'es' ? `/blog/${slug}` : `/en/blog/${slug}`

  return (
    <article
      ref={ref}
      className={`group overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 transition-all duration-500 hover:border-ocean-500/30 hover:shadow-lg hover:shadow-ocean-500/5 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
    >
      <Link to={href}>
        {post.cover_image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.cover_image}
              alt={coverAlt}
              width={800}
              height={450}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-6">
          {post.published_at && (
            <time className="text-sm text-slate-400" dateTime={post.published_at}>
              {formatDate(post.published_at, lang)}
            </time>
          )}
          <h2 className="mt-2 text-xl font-semibold text-white transition-colors group-hover:text-ocean-400">
            {title}
          </h2>
          <p className="mt-3 text-slate-300 line-clamp-3">{excerpt}</p>
          <span className="mt-4 inline-block text-sm font-medium text-ocean-400">
            {t.readMore} →
          </span>
        </div>
      </Link>
    </article>
  )
}

export default function BlogListPage({ lang }: { lang: Lang }) {
  const t = i18n[lang]
  const path = lang === 'es' ? '/blog' : '/en/blog'
  const { data: posts, isLoading } = useBlogPosts()

  useSEO({
    title: t.seoTitle,
    description: t.description,
    lang,
    path,
    schemas: [buildBreadcrumbs(path, lang, t.title)],
  })

  return (
    <div className="flex min-h-screen flex-col bg-slate-900">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <h1 className="text-center font-serif text-4xl font-bold text-white sm:text-5xl">
            {t.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-300">
            {t.description}
          </p>

          {isLoading ? (
            <div className="mt-16 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-ocean-600 border-t-transparent" />
            </div>
          ) : !posts || posts.length === 0 ? (
            <p className="mt-16 text-center text-slate-400">{t.empty}</p>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} lang={lang} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
