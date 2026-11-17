import { Link, useLocation, useParams } from 'react-router'

const WA = (import.meta.env.VITE_WHATSAPP_NUMBER as string) || ''
const WA_MSG_RECS = encodeURIComponent(
  "Hi! I'm planning a trip to Nosara — could you share some recommendations on things to do and surf lessons at Playa Guiones?",
)
const WA_MSG_BOOK = encodeURIComponent(
  "Hi! I'd like to book a surf lesson at Playa Guiones with Surfers Lab CR. Could you help me with the details?",
)

const EXPECT_SLUG = 'surf-lessons-nosara-what-to-expect'

/**
 * Reusable conversion call-to-action for blog posts.
 * Copy is intentionally English-only (target audience is US/Canada),
 * but links adapt to the current page language so UX never breaks.
 * - variant="final": prominent card at the end of every article.
 * - variant="inline": slim curiosity nudge placed mid-article.
 */
export default function BlogCTA({ variant }: { variant: 'final' | 'inline' }) {
  const { pathname } = useLocation()
  const { slug } = useParams<{ slug: string }>()
  const isEn = pathname.startsWith('/en')

  const waBook = `https://wa.me/${WA}?text=${WA_MSG_BOOK}`
  const waRecs = `https://wa.me/${WA}?text=${WA_MSG_RECS}`
  const expectHref = isEn ? `/en/blog/${EXPECT_SLUG}` : `/blog/${EXPECT_SLUG}`
  const onExpectPost = slug === EXPECT_SLUG

  if (variant === 'inline') {
    // Avoid linking the post to itself.
    if (onExpectPost) {
      return (
        <aside className="my-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border-l-4 border-coral-500 bg-slate-800 px-5 py-4">
          <p className="m-0 text-slate-100">🏄 Ready to get in the water at Playa Guiones?</p>
          <a
            href={waBook}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap font-semibold text-coral-400 transition-colors hover:text-coral-500"
          >
            Book your lesson →
          </a>
        </aside>
      )
    }
    return (
      <aside className="my-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border-l-4 border-coral-500 bg-slate-800 px-5 py-4">
        <p className="m-0 text-slate-100">🏄 Curious what your first lesson is like?</p>
        <Link
          to={expectHref}
          className="whitespace-nowrap font-semibold text-coral-400 transition-colors hover:text-coral-500"
        >
          What to expect →
        </Link>
      </aside>
    )
  }

  return (
    <aside className="relative my-12 overflow-hidden rounded-2xl border border-ocean-500/30 bg-gradient-to-br from-ocean-700 to-ocean-950 p-8 shadow-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-6 select-none text-[150px] leading-none opacity-10"
      >
        🌊
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-ocean-200">
        Surfers Lab CR · Playa Guiones, Nosara
      </p>
      <h3 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
        Ready to catch your first wave?
      </h3>
      <p className="mt-3 max-w-xl text-base text-ocean-100/90">
        Learn to surf with ISA-certified instructors at one of the best beginner beaches in the
        world. All gear included — just bring the stoke.
      </p>
      <div className="relative z-10 mt-6 flex flex-wrap gap-3">
        <a
          href={waBook}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-coral-600"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-white/90" aria-hidden="true" />
          Book your lesson
        </a>
        <a
          href={waRecs}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ocean-200/50 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-whatsapp" aria-hidden="true" />
          Ask us for recommendations
        </a>
      </div>
    </aside>
  )
}
