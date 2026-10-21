import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useInView } from 'react-intersection-observer'
import { Mail, MessageCircle, Waves, Video, MapPin, Star, ArrowRight, ChevronLeft, ChevronRight, CalendarCheck, Users, Check, ExternalLink } from 'lucide-react'
import { useSEO, buildLocalBusinessSchema } from '../shared/hooks/useSEO'
import { useGallery } from '../shared/hooks/useGallery'
import { usePackages } from '../shared/hooks/usePackages'
import { useReviews } from '../shared/hooks/useReviews'
import { usePublicInstructors } from '../shared/hooks/useInstructors'
import { useSiteSetting } from '../shared/hooks/useSiteSettings'
import type { GoogleReview } from '../shared/api/reviews'
import { formatPrice } from '@surf-app/utils'
import Navbar from '../shared/components/Navbar'
import Footer from '../shared/components/Footer'

const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJ-VT2s-VVno8R-5RMA8j1qdI'

type Lang = 'es' | 'en'

const i18n = {
  es: {
    seo: {
      title: 'Escuela de Surf en Playa Guiones, Nosara',
      description: 'Clases de surf en Playa Guiones, Nosara, Costa Rica. Instructores certificados ISA, video análisis y surf trips por Guanacaste. Reserva tu lección hoy.',
    },
    heroAlt: 'Clases de surf en Playa Guiones, Nosara — Surfers Lab CR',
    hero: {
      title: 'Escuela de Surf en Playa Guiones, Nosara',
      subtitle: 'Clases profesionales con instructores certificados, video análisis y surf trips en las mejores olas de Nosara, Costa Rica.',
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
          description: 'Aprende a surfear en Playa Guiones con instructores certificados. Desde principiantes hasta nivel avanzado, adaptamos cada clase a tu ritmo en las olas de Nosara.',
          includes: ['Tabla y rash guard', '1.5 — 2 horas de clase', 'Instructor certificado ISA', 'Calentamiento en Playa Guiones + práctica en el agua'],
        },
        {
          icon: Video,
          title: 'Video Análisis',
          serviceType: 'video_analysis' as const,
          description: 'Grabamos tu sesión en las olas de Playa Guiones y analizamos cada detalle de tu técnica para que progreses más rápido en Nosara.',
          includes: ['Grabación HD en Playa Guiones', 'Revisión cuadro por cuadro', 'Tips personalizados', 'Copia digital incluida'],
        },
        {
          icon: MapPin,
          title: 'Surf Trips',
          serviceType: 'surf_trip' as const,
          description: 'Exploramos los mejores spots de Guanacaste y Costa Rica desde Nosara. Organizamos todo para que solo te preocupes por surfear.',
          includes: ['Transporte desde Nosara al spot', 'Todo el equipo', 'Guía local experto', 'Snacks y agua'],
        },
      ],
    },
    howItWorks: {
      title: 'Cómo Funciona',
      steps: [
        {
          number: '1',
          icon: CalendarCheck,
          title: 'Reserva tu Clase',
          description: 'Elige tu servicio, selecciona la fecha y reserva tu clase de surf en Nosara en menos de 2 minutos.',
        },
        {
          number: '2',
          icon: Users,
          title: 'Nos Encontramos en Playa Guiones',
          description: 'Te recibimos en Playa Guiones, Nosara, con todo el equipo listo: tabla, rash guard y buena vibra.',
        },
        {
          number: '3',
          icon: Waves,
          title: '¡A Surfear!',
          description: 'Tu instructor te guía paso a paso en las olas de Nosara hasta que te pongas de pie en tu primera ola.',
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
      mission: 'Nuestra misión es compartir la pasión por el surf en Playa Guiones, Nosara, con personas de todo el mundo, en un ambiente seguro, divertido y respetuoso con el océano.',
      vision: 'Ser la escuela de surf más reconocida de Nosara y Costa Rica, referente en calidad de instrucción y experiencias auténticas en Guanacaste.',
      values: ['Pasión por el océano', 'Seguridad ante todo', 'Respeto al ambiente', 'Comunidad surf'],
      valuesTitle: 'Nuestros Valores',
    },
    testimonials: {
      title: 'Lo que dicen nuestros alumnos',
      leaveReview: 'Déjanos tu reseña en Google',
    },
    gallery: { title: 'Galería', viewAll: 'Ver galería completa' },
    faq: {
      title: 'Preguntas Frecuentes',
      viewAll: 'Ver todas las preguntas',
      items: [
        {
          q: '¿Necesito experiencia previa para tomar clases?',
          a: 'No, nuestras clases de surf en Playa Guiones están diseñadas para todos los niveles, desde principiantes absolutos hasta surfistas intermedios que quieren mejorar su técnica en Nosara.',
        },
        {
          q: '¿Qué debo llevar a mi clase de surf?',
          a: 'Solo necesitas traer protector solar biodegradable, traje de baño y una toalla. En nuestra escuela en Playa Guiones, Nosara, proporcionamos la tabla de surf, el rash guard y todo el equipo necesario.',
        },
        {
          q: '¿Cuánto dura una clase de surf?',
          a: 'Las clases de surf en Nosara tienen una duración aproximada de 1.5 a 2 horas, incluyendo calentamiento en la playa, instrucción en el agua y práctica libre en Playa Guiones.',
        },
        {
          q: '¿Los instructores están certificados?',
          a: 'Sí, todos nuestros instructores en Nosara cuentan con certificación ISA (International Surfing Association) y entrenamiento en primeros auxilios y rescate acuático.',
        },
      ],
    },
    contact: {
      title: 'Contáctanos',
      subtitle: 'Estamos listos para ayudarte a vivir la mejor experiencia de surf en Playa Guiones, Nosara.',
      whatsapp: 'WhatsApp',
      email: 'Email',
      reviewCta: '¿Disfrutaste tu experiencia? Déjanos tu reseña en Google',
    },
  },
  en: {
    seo: {
      title: 'Surf School in Playa Guiones, Nosara',
      description: 'Surf lessons at Playa Guiones, Nosara, Costa Rica. ISA certified instructors, video analysis and surf trips across Guanacaste. Book your lesson today.',
    },
    heroAlt: 'Surf lessons at Playa Guiones, Nosara — Surfers Lab CR',
    hero: {
      title: 'Surf School in Nosara, Costa Rica',
      subtitle: 'Professional surf lessons with certified instructors, video analysis, and surf trips on the best waves of Playa Guiones, Nosara.',
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
          description: 'Learn to surf at Playa Guiones with certified instructors. From beginners to advanced, we tailor every lesson to your pace on the waves of Nosara.',
          includes: ['Board & rash guard', '1.5 — 2 hour lesson', 'ISA certified instructor', 'Warm-up at Playa Guiones + water practice'],
        },
        {
          icon: Video,
          title: 'Video Analysis',
          serviceType: 'video_analysis' as const,
          description: 'We film your session on the waves of Playa Guiones and break down every detail of your technique so you progress faster in Nosara.',
          includes: ['HD recording at Playa Guiones', 'Frame-by-frame review', 'Personalized tips', 'Digital copy included'],
        },
        {
          icon: MapPin,
          title: 'Surf Trips',
          serviceType: 'surf_trip' as const,
          description: 'We explore the best surf spots across Guanacaste and Costa Rica from Nosara. We handle everything so you just focus on surfing.',
          includes: ['Transport from Nosara to the spot', 'All equipment', 'Expert local guide', 'Snacks & water'],
        },
      ],
    },
    howItWorks: {
      title: 'How It Works',
      steps: [
        {
          number: '1',
          icon: CalendarCheck,
          title: 'Book Your Lesson',
          description: 'Pick your service, choose a date, and book your surf lesson in Nosara in under 2 minutes.',
        },
        {
          number: '2',
          icon: Users,
          title: 'Meet at Playa Guiones',
          description: 'We welcome you at Playa Guiones, Nosara, with all the gear ready: board, rash guard, and good vibes.',
        },
        {
          number: '3',
          icon: Waves,
          title: 'Hit the Waves!',
          description: 'Your instructor guides you step by step on the waves of Nosara until you stand up on your first wave.',
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
      mission: 'Our mission is to share the passion for surfing at Playa Guiones, Nosara, with people from around the world, in a safe, fun, and ocean-respectful environment.',
      vision: 'To be the most recognized surf school in Nosara and Costa Rica, a reference for instruction quality and authentic experiences in Guanacaste.',
      values: ['Passion for the ocean', 'Safety first', 'Environmental respect', 'Surf community'],
      valuesTitle: 'Our Values',
    },
    testimonials: {
      title: 'What our students say',
      leaveReview: 'Leave us a Google review',
    },
    gallery: { title: 'Gallery', viewAll: 'View full gallery' },
    faq: {
      title: 'Frequently Asked Questions',
      viewAll: 'View all questions',
      items: [
        {
          q: 'Do I need previous experience to take lessons?',
          a: 'No, our surf lessons at Playa Guiones are designed for all levels, from absolute beginners to intermediate surfers looking to improve their technique in Nosara.',
        },
        {
          q: 'What should I bring to my surf lesson?',
          a: 'Just bring biodegradable sunscreen, a swimsuit, and a towel. At our surf school in Playa Guiones, Nosara, we provide the surfboard, rash guard, and all necessary equipment.',
        },
        {
          q: 'How long is a surf lesson?',
          a: 'Surf lessons in Nosara last approximately 1.5 to 2 hours, including warm-up on the beach, instruction in the water, and free practice at Playa Guiones.',
        },
        {
          q: 'Are the instructors certified?',
          a: 'Yes, all our surf instructors in Nosara hold ISA (International Surfing Association) certification and are trained in first aid and water rescue.',
        },
      ],
    },
    contact: {
      title: 'Contact Us',
      subtitle: "We're ready to help you experience the best surf adventure in Playa Guiones, Nosara.",
      whatsapp: 'WhatsApp',
      email: 'Email',
      reviewCta: 'Enjoyed your experience? Leave us a Google review',
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

  const { data: packages } = usePackages()
  const { data: galleryItems, isLoading: isGalleryLoading } = useGallery()
  const { data: instructors } = usePublicInstructors()
  const { reviews } = useReviews()

  const courseSchemas: Record<string, unknown>[] = (packages ?? []).map((pkg) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: lang === 'es' ? pkg.name : pkg.name_en,
    description: lang === 'es' ? pkg.description : pkg.description_en,
    provider: {
      '@type': 'SportsActivityLocation',
      name: 'Surfers Lab CR',
      url: 'https://surferlabscr.com',
    },
    offers: {
      '@type': 'Offer',
      price: pkg.price,
      priceCurrency: pkg.currency,
    },
    locationCreated: {
      '@type': 'Place',
      name: 'Playa Guiones, Nosara',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nosara',
        addressRegion: 'Guanacaste',
        addressCountry: 'CR',
      },
    },
  }))

  const aggregateRating = reviews.length > 0
    ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
          reviewCount: reviews.length,
          bestRating: 5,
        },
      }
    : undefined

  const localBusinessSchema = buildLocalBusinessSchema(t.seo.description, lang, aggregateRating)

  const faqSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  useSEO({
    title: t.seo.title,
    description: t.seo.description,
    lang,
    path: lang === 'es' ? '/' : '/en',
    schemas: [localBusinessSchema, ...courseSchemas, faqSchema],
  })
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
        <img
          src={heroImageUrl ?? 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1600'}
          alt={t.heroAlt}
          width={1600}
          height={1067}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: `center ${heroImagePos ?? 'center'}` }}
        />
        {/* Gradient: transparent top → dark bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/20 to-slate-900/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-40 text-center">
          <motion.p
            className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80 drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Surfers Lab CR
          </motion.p>
          <motion.h1
            className="mt-3 font-display text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t.hero.title}
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-white/90 drop-shadow-md sm:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t.hero.subtitle}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-coral-500" />
            </FadeIn>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {instructors.map((inst, i) => (
                <FadeIn key={inst.id} delay={i * 0.1}>
                  <div className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-ocean-400 hover:shadow-md">
                    {inst.photo_url ? (
                      <img
                        src={inst.photo_url}
                        alt={`${inst.full_name} — ${lang === 'es' ? 'instructor de surf en Nosara' : 'surf instructor in Nosara'}`}
                        width={128}
                        height={128}
                        loading="lazy"
                        decoding="async"
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
                    {(inst.bio || inst.bio_en) && (
                      <p className="mt-2 line-clamp-3 text-center text-sm leading-relaxed text-slate-600">
                        {lang === 'en' ? (inst.bio_en || inst.bio) : inst.bio}
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
      <section className="bg-sand-100 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <h2 className="font-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
              {t.services.title}
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-coral-500" />
          </FadeIn>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.items.map((svc, i) => (
              <FadeIn key={svc.title} delay={i * 0.1}>
                <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-ocean-400 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff7ed] text-coral-500">
                    <svc.icon size={24} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">{svc.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{svc.description}</p>
                  {svc.includes && (
                    <ul className="mt-4 space-y-1.5">
                      {svc.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                          <Check size={14} className="mt-0.5 shrink-0 text-ocean-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
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

      {/* Cómo funciona */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <h2 className="font-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
              {t.howItWorks.title}
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-coral-500" />
          </FadeIn>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {t.howItWorks.steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <span className="font-display text-5xl font-bold text-coral-500">{step.number}</span>
                  <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-sand-100">
                    <step.icon className="h-7 w-7 text-ocean-600" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
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
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-coral-500" />
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
      <section className="bg-sand-100 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <h2 className="font-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
              {t.about.title}
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-coral-500" />
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

      {/* Testimonios — solo se muestra con reseñas reales de Google */}
      <TestimonialsSection title={t.testimonials.title} leaveReviewText={t.testimonials.leaveReview} />

      {/* Galería preview */}
      {(isGalleryLoading || preview.length > 0) && (
        <section className="bg-sand-100 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn>
              <h2 className="font-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
                {t.gallery.title}
              </h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-coral-500" />
            </FadeIn>
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isGalleryLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-slate-200/60" />
                  ))
                : preview.map((item, i) => (
                    <GalleryPreviewItem key={item.id} item={item} index={i} lang={lang} />
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

      {/* FAQ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6">
          <FadeIn>
            <h2 className="font-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
              {t.faq.title}
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-coral-500" />
          </FadeIn>
          <div className="mt-10 space-y-4">
            {t.faq.items.map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <details className="group rounded-2xl border border-slate-200 bg-sand-100 transition-colors open:bg-white open:shadow-sm">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left font-display text-lg font-semibold text-ocean-600 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="shrink-0 text-2xl leading-none text-ocean-400 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-6 pb-5 text-sm leading-relaxed text-slate-600">
                    {item.a}
                  </div>
                </details>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <div className="mt-8 text-center">
              <Link
                to={lang === 'es' ? '/preguntas-frecuentes' : '/en/faq'}
                className="inline-flex items-center gap-2 text-sm font-semibold text-ocean-600 transition hover:text-ocean-700"
              >
                {t.faq.viewAll}
                <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Contacto */}
      <section className="bg-sand-100 py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">{t.contact.title}</h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-coral-500" />
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
          <FadeIn delay={0.2}>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-ocean-600"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32l3.57 2.77c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t.contact.reviewCta}
              <ExternalLink size={12} />
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// ─── Testimonials Section ────────────────────────────────────────────────────

function TestimonialsSection({ title, leaveReviewText }: { title: string; leaveReviewText: string }) {
  const { reviews, isLoading, isError } = useReviews()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ])

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onInit = () => setScrollSnaps(emblaApi.scrollSnapList())
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('reInit', onInit).on('select', onSelect)
    onInit()
    onSelect()
    return () => { emblaApi.off('reInit', onInit).off('select', onSelect) }
  }, [emblaApi])

  if (!isLoading && (isError || reviews.length === 0)) return null

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <h2 className="font-display text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            {title}
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-coral-500" />
        </FadeIn>

        <div className="relative mt-12">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-16" />

          {reviews.length > 0 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm transition-colors hover:bg-ocean-50"
                aria-label="Previous"
              >
                <ChevronLeft size={20} className="text-slate-700" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm transition-colors hover:bg-ocean-50"
                aria-label="Next"
              >
                <ChevronRight size={20} className="text-slate-700" />
              </button>
            </>
          )}

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-0 flex-[0_0_100%] px-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%]"
                  >
                    <div className="h-52 animate-pulse rounded-2xl bg-slate-100" />
                  </div>
                ))}

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

        {scrollSnaps.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === selectedIndex
                    ? 'w-6 bg-ocean-600'
                    : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-ocean-300 hover:shadow-md"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32l3.57 2.77c2.08-1.92 3.27-4.74 3.27-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {leaveReviewText}
            <ExternalLink size={14} className="text-slate-400" />
          </a>
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
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
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
  lang,
}: {
  item: { url: string; alt_text?: string; alt_text_en?: string; media_type?: string; category?: string }
  index: number
  lang: Lang
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const isVideo = item.media_type === 'video'
  const categoryLabels: Record<string, Record<string, string>> = {
    es: { lessons: 'Clases de surf', trips: 'Surf trips', video_analysis: 'Video análisis', general: 'Surf' },
    en: { lessons: 'Surf lessons', trips: 'Surf trips', video_analysis: 'Video analysis', general: 'Surf' },
  }
  const fallback = item.category
    ? `${categoryLabels[lang][item.category] ?? item.category.replace('_', ' ')} — Surfers Lab CR`
    : lang === 'es' ? 'Surfers Lab CR — Escuela de surf en Nosara' : 'Surfers Lab CR — Surf school in Nosara'
  const alt = (lang === 'en' ? item.alt_text_en || item.alt_text : item.alt_text) || fallback

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
        alt={alt}
        width={600}
        height={450}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
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
