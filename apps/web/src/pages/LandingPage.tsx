import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { useInView } from 'react-intersection-observer'
import { Mail, MessageCircle, Waves, Video, MapPin, Star, ArrowRight } from 'lucide-react'
import { useSEO } from '../shared/hooks/useSEO'
import { useGallery } from '../shared/hooks/useGallery'
import { usePackages } from '../shared/hooks/usePackages'
import { useReviews } from '../shared/hooks/useReviews'
import { usePublicInstructors } from '../shared/hooks/useInstructors'
import { useSiteSetting } from '../shared/hooks/useSiteSettings'
import type { GoogleReview } from '../shared/api/reviews'
import { formatPrice } from '@surf-app/utils'
import Navbar from '../shared/components/Navbar'
import Footer from '../shared/components/Footer'

type Lang = 'es' | 'en'

const i18n = {
  es: {
    seo: {
      title: 'Clases de Surf en Costa Rica',
      description: 'Aprende surf con instructores certificados en Costa Rica. Clases, video análisis y surf trips.',
    },
    hero: {
      title: 'Vive el Surf en Costa Rica',
      subtitle: 'Clases profesionales, video análisis y surf trips en las mejores olas de Costa Rica.',
      ctaWhatsapp: 'Contáctanos por WhatsApp',
      ctaEmail: 'Escríbenos por Email',
    },
    services: {
      title: 'Nuestros Servicios',
      cta: 'Reservar',
      items: [
        {
          icon: Waves,
          title: 'Clases de Surf',
          serviceType: 'surf_lesson' as const,
          description: 'Aprende a surfear con instructores certificados. Desde principiantes hasta nivel avanzado, adaptamos cada clase a tu ritmo.',
        },
        {
          icon: Video,
          title: 'Video Análisis',
          serviceType: 'video_analysis' as const,
          description: 'Grabamos tu sesión y analizamos cada detalle de tu técnica para que progreses más rápido.',
        },
        {
          icon: MapPin,
          title: 'Surf Trips',
          serviceType: 'surf_trip' as const,
          description: 'Exploramos los mejores spots de Costa Rica. Organizamos todo para que solo te preocupes por surfear.',
        },
      ],
    },
    instructors: {
      title: 'Nuestros Instructores',
      cta: 'Ver perfil',
    },
    packages: { title: 'Nuestros Paquetes', cta: 'Reservar' },
    about: {
      title: 'Quiénes Somos',
      mission: 'Nuestra misión es compartir la pasión por el surf con personas de todo el mundo, en un ambiente seguro, divertido y respetuoso con el océano.',
      vision: 'Ser la escuela de surf más reconocida de Costa Rica, referente en calidad de instrucción y experiencias auténticas.',
      values: ['Pasión por el océano', 'Seguridad ante todo', 'Respeto al ambiente', 'Comunidad surf'],
      valuesTitle: 'Nuestros Valores',
    },
    testimonials: {
      title: 'Lo que dicen nuestros alumnos',
      fallback: [
        { name: 'María G.', country: 'México', text: 'Increíble experiencia. En tres días ya estaba surfeando olas reales. Los instructores son súper pacientes y profesionales.' },
        { name: 'James T.', country: 'USA', text: "Best surf lessons I've ever had. The video analysis totally changed my technique. Highly recommend!" },
        { name: 'Ana R.', country: 'España', text: 'Vine sola y me sentí parte de una familia desde el primer día. El surf trip fue lo más épico de mi viaje.' },
      ],
    },
    gallery: { title: 'Galería', viewAll: 'Ver galería completa' },
    contact: {
      title: 'Contáctanos',
      subtitle: 'Estamos listos para ayudarte a vivir la mejor experiencia de surf.',
      whatsapp: 'WhatsApp',
      email: 'Email',
    },
  },
  en: {
    seo: {
      title: 'Surf Lessons in Costa Rica',
      description: 'Learn to surf with certified instructors in Costa Rica. Lessons, video analysis and surf trips.',
    },
    hero: {
      title: 'Experience Surfing in Costa Rica',
      subtitle: 'Professional surf lessons, video analysis, and surf trips on the best waves in Costa Rica.',
      ctaWhatsapp: 'Contact us on WhatsApp',
      ctaEmail: 'Send us an Email',
    },
    services: {
      title: 'Our Services',
      cta: 'Book Now',
      items: [
        {
          icon: Waves,
          title: 'Surf Lessons',
          serviceType: 'surf_lesson' as const,
          description: 'Learn to surf with certified instructors. From beginners to advanced, we tailor every lesson to your pace.',
        },
        {
          icon: Video,
          title: 'Video Analysis',
          serviceType: 'video_analysis' as const,
          description: 'We film your session and break down every detail of your technique so you progress faster.',
        },
        {
          icon: MapPin,
          title: 'Surf Trips',
          serviceType: 'surf_trip' as const,
          description: 'We explore the best spots in Costa Rica. We handle everything so you just focus on surfing.',
        },
      ],
    },
    instructors: {
      title: 'Our Instructors',
      cta: 'View profile',
    },
    packages: { title: 'Our Packages', cta: 'Book Now' },
    about: {
      title: 'About Us',
      mission: 'Our mission is to share the passion for surfing with people from around the world, in a safe, fun, and ocean-respectful environment.',
      vision: 'To be the most recognized surf school in Costa Rica, a reference for instruction quality and authentic experiences.',
      values: ['Passion for the ocean', 'Safety first', 'Environmental respect', 'Surf community'],
      valuesTitle: 'Our Values',
    },
    testimonials: {
      title: 'What our students say',
      fallback: [
        { name: 'María G.', country: 'Mexico', text: 'Incredible experience. In three days I was surfing real waves. The instructors are super patient and professional.' },
        { name: 'James T.', country: 'USA', text: "Best surf lessons I've ever had. The video analysis totally changed my technique. Highly recommend!" },
        { name: 'Ana R.', country: 'Spain', text: 'I came alone and felt part of a family from day one. The surf trip was the most epic part of my trip.' },
      ],
    },
    gallery: { title: 'Gallery', viewAll: 'View full gallery' },
    contact: {
      title: 'Contact Us',
      subtitle: "We're ready to help you experience the best surf adventure.",
      whatsapp: 'WhatsApp',
      email: 'Email',
    },
  },
}

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

export default function LandingPage({ lang }: { lang: Lang }) {
  const t = i18n[lang]
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER as string
  const email = import.meta.env.VITE_CONTACT_EMAIL as string
  const waHref = `https://wa.me/${wa}`
  const mailHref = `mailto:${email}`
  const galleryHref = lang === 'es' ? '/galeria' : '/en/gallery'
  const bookingBase = lang === 'es' ? '/reservar' : '/en/book'

  useSEO({ title: t.seo.title, description: t.seo.description, lang })

  const { data: packages } = usePackages()
  const { data: galleryItems, isLoading: isGalleryLoading } = useGallery()
  const { data: instructors } = usePublicInstructors()
  const { data: heroImageUrl } = useSiteSetting('hero_image_url')
  const { data: heroImagePos } = useSiteSetting('hero_image_position')
  const preview = galleryItems?.slice(0, 6) ?? []
  const instructorBase = lang === 'es' ? '/instructores' : '/en/instructors'

  return (
    <div className="min-h-screen bg-white font-body text-slate-900">
      <Navbar />

      {/* Hero */}
      <section
        id="hero"
        className="relative flex min-h-[90vh] items-end justify-center overflow-hidden bg-slate-900"
      >
        {/* Full-color background image */}
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(${heroImageUrl ?? 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1600'})`,
            backgroundPosition: `center ${heroImagePos ?? 'center'}`,
          }}
        />
        {/* Gradient: transparent top → dark bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/20 to-slate-900/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-40 text-center">
          <motion.h1
            className="font-display text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t.hero.title}
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-white/90 drop-shadow-md sm:text-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t.hero.subtitle}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#25a855] px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-[#1a8a44]"
            >
              <MessageCircle size={20} />
              {t.hero.ctaWhatsapp}
            </a>
            <a
              href={mailHref}
              className="flex items-center gap-2 rounded-full border border-white/60 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <Mail size={20} />
              {t.hero.ctaEmail}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Instructores */}
      {instructors && instructors.length > 0 && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn>
              <h2 className="font-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
                {t.instructors.title}
              </h2>
            </FadeIn>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {instructors.map((inst, i) => (
                <FadeIn key={inst.id} delay={i * 0.1}>
                  <div className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-ocean-400 hover:shadow-md">
                    {inst.photo_url ? (
                      <img
                        src={inst.photo_url}
                        alt={inst.full_name}
                        className="h-32 w-32 rounded-full object-cover shadow-md"
                      />
                    ) : (
                      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-ocean-100 text-3xl font-bold text-ocean-600">
                        {inst.full_name.charAt(0)}
                      </div>
                    )}
                    <h3 className="mt-5 font-display text-xl font-semibold text-slate-900">
                      {inst.full_name}
                    </h3>
                    {inst.bio && (
                      <p className="mt-2 line-clamp-3 text-center text-sm leading-relaxed text-slate-600">
                        {inst.bio}
                      </p>
                    )}
                    <Link
                      to={`${instructorBase}/${inst.id}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-600 transition hover:text-ocean-700"
                    >
                      {t.instructors.cta}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Servicios */}
      <section className="bg-mist-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <h2 className="font-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
              {t.services.title}
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.items.map((svc, i) => (
              <FadeIn key={svc.title} delay={i * 0.1}>
                <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-ocean-400 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ocean-100 text-ocean-600">
                    <svc.icon size={24} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">{svc.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{svc.description}</p>
                  <Link
                    to={`${bookingBase}?service=${svc.serviceType}`}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-coral-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-coral-600"
                  >
                    {t.services.cta}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Paquetes */}
      {packages && packages.length > 0 && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn>
              <h2 className="font-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
                {t.packages.title}
              </h2>
            </FadeIn>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg, i) => (
                <FadeIn key={pkg.id} delay={i * 0.1}>
                  <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-ocean-400 hover:shadow-md">
                    <h3 className="font-display text-xl font-semibold text-slate-900">
                      {lang === 'es' ? pkg.name : pkg.name_en}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {lang === 'es' ? pkg.description : pkg.description_en}
                    </p>
                    <p className="mt-4 text-2xl font-bold text-coral-500">
                      {formatPrice(pkg.price, pkg.currency)}
                    </p>
                    <Link
                      to={bookingBase}
                      className="mt-6 flex items-center justify-center gap-2 rounded-full bg-coral-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-coral-600"
                    >
                      {t.packages.cta}
                    </Link>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quiénes somos */}
      <section className="bg-mist-50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <h2 className="font-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
              {t.about.title}
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <FadeIn>
              <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <h3 className="font-display text-lg font-semibold text-ocean-600">
                  {lang === 'es' ? 'Misión' : 'Mission'}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{t.about.mission}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <h3 className="font-display text-lg font-semibold text-coral-500">
                  {lang === 'es' ? 'Visión' : 'Vision'}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{t.about.vision}</p>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
              <h3 className="font-display text-lg font-semibold text-slate-800">{t.about.valuesTitle}</h3>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {t.about.values.map((v) => (
                  <li key={v} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-coral-500" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonios — Google Reviews con fallback estático */}
      <TestimonialsSection title={t.testimonials.title} fallback={t.testimonials.fallback} />

      {/* Galería preview */}
      {(isGalleryLoading || preview.length > 0) && (
        <section className="bg-mist-50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn>
              <h2 className="font-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
                {t.gallery.title}
              </h2>
            </FadeIn>
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isGalleryLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-slate-200/60" />
                  ))
                : preview.map((item, i) => (
                    <GalleryPreviewItem key={item.id} item={item} index={i} />
                  ))}
            </div>
            {!isGalleryLoading && (
              <div className="mt-10 text-center">
                <Link
                  to={galleryHref}
                  className="inline-flex items-center gap-2 rounded-full bg-ocean-600 px-8 py-3 font-semibold text-white transition hover:bg-ocean-700"
                >
                  {t.gallery.viewAll}
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contacto */}
      <section className="bg-mist-50 py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">{t.contact.title}</h2>
            <p className="mt-4 text-slate-600">{t.contact.subtitle}</p>
            <p className="mt-2 text-sm font-semibold text-ocean-600">+{wa}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-[#25a855] px-8 py-3 font-semibold text-white shadow-md transition hover:bg-[#1a8a44]"
              >
                <MessageCircle size={20} />
                {t.contact.whatsapp}
              </a>
              <a
                href={mailHref}
                className="flex items-center gap-2 rounded-full border border-slate-300 px-8 py-3 font-semibold text-slate-700 transition hover:bg-white"
              >
                <Mail size={20} />
                {t.contact.email}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// ─── Testimonials Section ────────────────────────────────────────────────────

type StaticTestimonial = { name: string; country: string; text: string }

function TestimonialsSection({
  title,
  fallback,
}: {
  title: string
  fallback: StaticTestimonial[]
}) {
  const { reviews, isLoading, isError } = useReviews()
  const [emblaRef] = useEmblaCarousel({ loop: true })

  const showFallback = !isLoading && (isError || reviews.length === 0)

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <h2 className="font-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            {title}
          </h2>
        </FadeIn>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {/* Loading: 3 skeletons */}
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-0 flex-[0_0_100%] px-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%]"
                >
                  <div className="h-52 animate-pulse rounded-2xl bg-slate-100" />
                </div>
              ))}

            {/* Fallback estático */}
            {showFallback &&
              fallback.map((item) => (
                <div
                  key={item.name}
                  className="min-w-0 flex-[0_0_100%] px-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%]"
                >
                  <div className="h-full rounded-2xl border border-slate-200 bg-mist-50 p-8">
                    <div className="mb-4 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-sand-400 text-sand-400" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">"{item.text}"</p>
                    <div className="mt-6">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-ocean-600">{item.country}</p>
                    </div>
                  </div>
                </div>
              ))}

            {/* Google Reviews reales */}
            {!isLoading &&
              !isError &&
              reviews.map((review) => (
                <div
                  key={`${review.author_name}-${review.time}`}
                  className="min-w-0 flex-[0_0_100%] px-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%]"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Review Card ─────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: GoogleReview }) {
  const initial = review.author_name.charAt(0).toUpperCase()
  const truncated =
    review.text.length > 150 ? review.text.slice(0, 150).trimEnd() + '…' : review.text

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header: avatar + nombre */}
      <div className="flex items-center gap-3">
        {review.profile_photo_url ? (
          <img
            src={review.profile_photo_url}
            alt={review.author_name}
            className="h-10 w-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ocean-600 text-sm font-semibold text-white">
            {initial}
          </div>
        )}
        <div>
          <p className="font-semibold leading-tight text-slate-900">{review.author_name}</p>
          <p className="text-xs text-slate-400">{review.relative_time_description}</p>
        </div>
      </div>

      {/* Estrellas */}
      <div className="mt-4 flex gap-0.5">
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

      {/* Texto */}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">"{truncated}"</p>

      {/* Badge Google */}
      <div className="mt-4 flex items-center gap-1.5">
        {/* Ícono G simplificado */}
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-coral-500"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span className="text-xs font-medium text-slate-400">Google Reviews</span>
      </div>
    </div>
  )
}

// ─── Gallery Preview Item ─────────────────────────────────────────────────────

function GalleryPreviewItem({
  item,
  index,
}: {
  item: { url: string; alt_text?: string; alt_text_en?: string; media_type?: string; category?: string }
  index: number
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const isVideo = item.media_type === 'video'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100"
    >
      <img
        src={item.url}
        alt={item.alt_text ?? ''}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {item.category && (
          <span className="m-3 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium capitalize text-ocean-700 backdrop-blur-sm">
            {item.category.replace('_', ' ')}
          </span>
        )}
      </div>
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
            <svg className="ml-1 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  )
}
