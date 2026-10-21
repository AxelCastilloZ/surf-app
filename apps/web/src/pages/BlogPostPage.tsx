import { useParams, Link } from 'react-router-dom'
import { useSEO, buildBreadcrumbs } from '../shared/hooks/useSEO'
import { useBlogPost } from '../shared/hooks/useBlog'
import Navbar from '../shared/components/Navbar'
import Footer from '../shared/components/Footer'

type Lang = 'es' | 'en'

const i18n = {
  es: {
    backToBlog: '← Volver al blog',
    notFound: 'Artículo no encontrado',
    notFoundDesc: 'El artículo que buscas no existe o fue removido.',
    loading: 'Cargando...',
  },
  en: {
    backToBlog: '← Back to blog',
    notFound: 'Article not found',
    notFoundDesc: 'The article you are looking for does not exist or was removed.',
    loading: 'Loading...',
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

function buildArticleSchema(
  title: string,
  description: string,
  slug: string,
  publishedAt: string | null,
  coverImage: string | null,
  lang: Lang,
) {
  const siteUrl = (import.meta.env.VITE_SITE_URL as string).replace(/\/$/, '')
  const brandName = import.meta.env.VITE_BRAND_NAME as string
  const path = lang === 'es' ? `/blog/${slug}` : `/en/blog/${slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${siteUrl}${path}`,
    inLanguage: lang,
    ...(publishedAt && { datePublished: publishedAt }),
    ...(coverImage && { image: coverImage }),
    author: {
      '@type': 'Organization',
      name: brandName,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: brandName,
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/assets/icons/logo4k.png` },
    },
  }
}

export default function BlogPostPage({ lang }: { lang: Lang }) {
  const { slug } = useParams<{ slug: string }>()
  const t = i18n[lang]
  const blogPath = lang === 'es' ? '/blog' : '/en/blog'
  const { data: post, isLoading } = useBlogPost(slug ?? '')

  const title = post ? (lang === 'en' ? post.title_en : post.title) : t.notFound
  const description = post
    ? (lang === 'en' ? post.meta_description_en || post.excerpt_en : post.meta_description || post.excerpt)
    : t.notFoundDesc
  const content = post ? (lang === 'en' ? post.content_en : post.content) : ''
  const coverAlt = post ? (lang === 'en' ? post.cover_image_alt_en || post.cover_image_alt : post.cover_image_alt) : ''
  const path = lang === 'es' ? `/blog/${slug}` : `/en/blog/${slug}`

  const schemas = post
    ? [
        buildBreadcrumbs(path, lang, title),
        buildArticleSchema(title, description, post.slug, post.published_at, post.cover_image, lang),
      ]
    : []

  useSEO({
    title,
    description,
    lang,
    path,
    schemas,
    noindex: !post,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-900">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ocean-600 border-t-transparent" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-900">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-bold text-white">{t.notFound}</h1>
          <p className="mt-4 text-slate-400">{t.notFoundDesc}</p>
          <Link to={blogPath} className="mt-6 text-ocean-400 hover:text-ocean-300">
            {t.backToBlog}
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-900">
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <Link to={blogPath} className="text-sm text-ocean-400 hover:text-ocean-300">
            {t.backToBlog}
          </Link>

          {post.published_at && (
            <time className="mt-6 block text-sm text-slate-400" dateTime={post.published_at}>
              {formatDate(post.published_at, lang)}
            </time>
          )}

          <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={coverAlt}
              width={1200}
              height={675}
              className="mt-8 w-full rounded-2xl object-cover"
            />
          )}

          <div
            className="blog-content mt-10 text-lg leading-relaxed text-slate-300"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      </main>
      <Footer />
    </div>
  )
}
