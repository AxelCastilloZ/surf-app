import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import useEmblaCarousel from 'embla-carousel-react'
import { Star, ArrowLeft, Send, MessageSquarePlus } from 'lucide-react'
import { useSEO } from '../shared/hooks/useSEO'
import { usePublicInstructor } from '../shared/hooks/useInstructors'
import { useInstructorReviews } from '../shared/hooks/useInstructorReviews'
import Navbar from '../shared/components/Navbar'
import Footer from '../shared/components/Footer'

type Lang = 'es' | 'en'

const API_URL = import.meta.env.VITE_API_URL as string

const i18n = {
  es: {
    back: 'Volver al inicio',
    bookWith: 'Reservar con',
    leaveReview: 'Dejar una reseña',
    reviews: 'Reseñas',
    noReviews: 'Aún no hay reseñas para este instructor.',
    notFound: 'Instructor no encontrado',
    loading: 'Cargando...',
    reviewCount: (n: number) => `${n} reseña${n !== 1 ? 's' : ''}`,
    form: {
      title: 'Deja tu reseña',
      bookingId: 'ID de tu reserva',
      bookingIdHint: 'Lo encontrarás en el correo de confirmación que recibiste.',
      rating: 'Calificación',
      comment: 'Comentario (opcional)',
      commentPlaceholder: 'Cuéntanos sobre tu experiencia...',
      submit: 'Enviar reseña',
      submitting: 'Enviando...',
      success: '¡Gracias por tu reseña!',
      cancel: 'Cancelar',
    },
  },
  en: {
    back: 'Back to home',
    bookWith: 'Book with',
    leaveReview: 'Leave a review',
    reviews: 'Reviews',
    noReviews: 'No reviews yet for this instructor.',
    notFound: 'Instructor not found',
    loading: 'Loading...',
    reviewCount: (n: number) => `${n} review${n !== 1 ? 's' : ''}`,
    form: {
      title: 'Leave a review',
      bookingId: 'Your booking ID',
      bookingIdHint: "You'll find it in the confirmation email you received.",
      rating: 'Rating',
      comment: 'Comment (optional)',
      commentPlaceholder: 'Tell us about your experience...',
      submit: 'Submit review',
      submitting: 'Submitting...',
      success: 'Thank you for your review!',
      cancel: 'Cancel',
    },
  },
}

const CAROUSEL_THRESHOLD = 3

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={28}
            className={
              star <= (hover || value)
                ? 'fill-sand-400 text-sand-400'
                : 'fill-slate-200 text-slate-200'
            }
          />
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review, lang }: { review: { id: string; client_name: string; rating: number; comment: string | null; created_at: string }; lang: Lang }) {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ocean-100 text-sm font-semibold text-ocean-600">
          {review.client_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{review.client_name}</p>
          <p className="text-xs text-slate-400">
            {new Date(review.created_at).toLocaleDateString(lang === 'es' ? 'es-CR' : 'en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= review.rating
                ? 'fill-sand-400 text-sand-400'
                : 'fill-slate-200 text-slate-200'
            }
          />
        ))}
      </div>
      {review.comment && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          "{review.comment}"
        </p>
      )}
    </div>
  )
}

function ReviewFormModal({
  instructorId,
  lang,
  onSuccess,
  onClose,
}: {
  instructorId: string
  lang: Lang
  onSuccess: () => void
  onClose: () => void
}) {
  const t = i18n[lang].form

  const [bookingId, setBookingId] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!bookingId.trim() || rating === 0) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/instructors/${instructorId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId.trim(),
          rating,
          comment: comment.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message ?? (lang === 'es' ? 'Error al enviar la reseña' : 'Failed to submit review'))
      }

      setSuccess(true)
      onSuccess()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

        {/* Panel */}
        <motion.div
          className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
        >
          {success ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Star size={24} className="fill-green-600 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-green-700">{t.success}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-full border border-slate-200 px-6 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                {t.cancel}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="font-display text-lg font-semibold text-slate-900">{t.title}</h3>

              <div className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">{t.bookingId}</label>
                  <input
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-ocean-400 focus:ring-2 focus:ring-ocean-400/20"
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  />
                  <p className="text-xs text-slate-400">{t.bookingIdHint}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">{t.rating}</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">{t.comment}</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-ocean-400 focus:ring-2 focus:ring-ocean-400/20 resize-none"
                    placeholder={t.commentPlaceholder}
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting || !bookingId.trim() || rating === 0}
                    className="inline-flex items-center gap-2 rounded-full bg-coral-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-coral-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        {t.submitting}
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        {t.submit}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-sm font-medium text-slate-500 transition hover:text-slate-700"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function InstructorProfilePage({ lang }: { lang: Lang }) {
  const { id } = useParams<{ id: string }>()
  const t = i18n[lang]
  const bookingBase = lang === 'es' ? '/reservar' : '/en/book'
  const homeHref = lang === 'es' ? '/' : '/en'

  const { data: instructor, isLoading, isError } = usePublicInstructor(id!)
  const { data: reviewsData, refetch: refetchReviews } = useInstructorReviews(id!)

  const [showReviewForm, setShowReviewForm] = useState(false)

  useSEO({
    title: instructor?.full_name ?? t.loading,
    description: instructor?.bio ?? '',
    lang,
  })

  const reviews = reviewsData?.data ?? []
  const meta = reviewsData?.meta
  const useCarousel = reviews.length >= CAROUSEL_THRESHOLD

  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-body">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ocean-600 border-t-transparent" />
        </div>
        <Footer />
      </div>
    )
  }

  if (isError || !instructor) {
    return (
      <div className="min-h-screen bg-white font-body">
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <p className="text-lg text-slate-500">{t.notFound}</p>
          <Link to={homeHref} className="text-ocean-600 hover:underline">
            {t.back}
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-body text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 pt-28 pb-16">
        <Link
          to={homeHref}
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-ocean-600 transition"
        >
          <ArrowLeft size={16} />
          {t.back}
        </Link>

        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="shrink-0"
          >
            {instructor.photo_url ? (
              <img
                src={instructor.photo_url}
                alt={instructor.full_name}
                className="h-56 w-56 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-ocean-100 text-5xl font-bold text-ocean-600">
                {instructor.full_name.charAt(0)}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 text-center md:text-left"
          >
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              {instructor.full_name}
            </h1>

            {meta && meta.count > 0 && (
              <div className="mt-3 flex items-center justify-center gap-2 md:justify-start">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= Math.round(meta.average_rating)
                          ? 'fill-sand-400 text-sand-400'
                          : 'fill-slate-200 text-slate-200'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-500">
                  {meta.average_rating} · {t.reviewCount(meta.count)}
                </span>
              </div>
            )}

            {instructor.bio && (
              <p className="mt-6 text-base leading-relaxed text-slate-600">
                {instructor.bio}
              </p>
            )}

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
              <Link
                to={`${bookingBase}?instructor=${instructor.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-coral-500 px-8 py-3 font-semibold text-white transition hover:bg-coral-600"
              >
                {t.bookWith} {instructor.full_name.split(' ')[0]}
              </Link>
              <button
                type="button"
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-ocean-400 hover:text-ocean-600"
              >
                <MessageSquarePlus size={16} />
                {t.leaveReview}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-mist-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <h2 className="font-display text-center text-2xl font-bold sm:text-3xl">
              {t.reviews}
            </h2>
          </FadeIn>

          {reviews.length === 0 && (
            <FadeIn delay={0.1}>
              <p className="mt-8 text-center text-slate-400">{t.noReviews}</p>
            </FadeIn>
          )}

          {reviews.length > 0 && !useCarousel && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {reviews.map((review, i) => (
                <FadeIn key={review.id} delay={i * 0.05}>
                  <ReviewCard review={review} lang={lang} />
                </FadeIn>
              ))}
            </div>
          )}

          {reviews.length > 0 && useCarousel && (
            <div className="mt-10 overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="min-w-0 flex-[0_0_100%] px-3 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%]"
                  >
                    <ReviewCard review={review} lang={lang} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewFormModal
          instructorId={id!}
          lang={lang}
          onSuccess={() => refetchReviews()}
          onClose={() => setShowReviewForm(false)}
        />
      )}

      <Footer />
    </div>
  )
}
