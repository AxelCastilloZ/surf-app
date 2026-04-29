import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { useInView } from 'react-intersection-observer'
import { Mail, MessageCircle, Waves, Video, MapPin, Star } from 'lucide-react'
import { useSEO } from '../shared/hooks/useSEO'
import { useGallery } from '../shared/hooks/useGallery'
import { usePackages } from '../shared/hooks/usePackages'
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
      items: [
        {
          icon: Waves,
          title: 'Clases de Surf',
          description: 'Aprende a surfear con instructores certificados. Desde principiantes hasta nivel avanzado, adaptamos cada clase a tu ritmo.',
        },
        {
          icon: Video,
          title: 'Video Análisis',
          description: 'Grabamos tu sesión y analizamos cada detalle de tu técnica para que progreses más rápido.',
        },
        {
          icon: MapPin,
          title: 'Surf Trips',
          description: 'Exploramos los mejores spots de Costa Rica. Organizamos todo para que solo te preocupes por surfear.',
        },
      ],
    },
    packages: { title: 'Nuestros Paquetes', cta: 'Reservar por WhatsApp' },
    about: {
      title: 'Quiénes Somos',
      mission: 'Nuestra misión es compartir la pasión por el surf con personas de todo el mundo, en un ambiente seguro, divertido y respetuoso con el océano.',
      vision: 'Ser la escuela de surf más reconocida de Costa Rica, referente en calidad de instrucción y experiencias auténticas.',
      values: ['Pasión por el océano', 'Seguridad ante todo', 'Respeto al ambiente', 'Comunidad surf'],
      valuesTitle: 'Nuestros Valores',
    },
    testimonials: {
      title: 'Lo que dicen nuestros alumnos',
      items: [
        { name: 'María G.', country: 'México', text: 'Increíble experiencia. En tres días ya estaba surfeando olas reales. Los instructores son súper pacientes y profesionales.' },
        { name: 'James T.', country: 'USA', text: 'Best surf lessons I\'ve ever had. The video analysis totally changed my technique. Highly recommend!' },
        { name: 'Ana R.', country: 'España', text: 'Vine sola y me sentí parte de una familia desde el primer día. El surf trip fue lo más épico de mi viaje.' },
        { name: 'Lucas M.', country: 'Brasil', text: 'Professores incríveis e ondas perfeitas. Voltarei com certeza ano que vem!' },
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
      items: [
        {
          icon: Waves,
          title: 'Surf Lessons',
          description: 'Learn to surf with certified instructors. From beginners to advanced, we tailor every lesson to your pace.',
        },
        {
          icon: Video,
          title: 'Video Analysis',
          description: 'We film your session and break down every detail of your technique so you progress faster.',
        },
        {
          icon: MapPin,
          title: 'Surf Trips',
          description: 'We explore the best spots in Costa Rica. We handle everything so you just focus on surfing.',
        },
      ],
    },
    packages: { title: 'Our Packages', cta: 'Book via WhatsApp' },
    about: {
      title: 'About Us',
      mission: 'Our mission is to share the passion for surfing with people from around the world, in a safe, fun, and ocean-respectful environment.',
      vision: 'To be the most recognized surf school in Costa Rica, a reference for instruction quality and authentic experiences.',
      values: ['Passion for the ocean', 'Safety first', 'Environmental respect', 'Surf community'],
      valuesTitle: 'Our Values',
    },
    testimonials: {
      title: 'What our students say',
      items: [
        { name: 'María G.', country: 'Mexico', text: 'Incredible experience. In three days I was surfing real waves. The instructors are super patient and professional.' },
        { name: 'James T.', country: 'USA', text: 'Best surf lessons I\'ve ever had. The video analysis totally changed my technique. Highly recommend!' },
        { name: 'Ana R.', country: 'Spain', text: 'I came alone and felt part of a family from day one. The surf trip was the most epic part of my trip.' },
        { name: 'Lucas M.', country: 'Brazil', text: 'Amazing instructors and perfect waves. I will definitely be back next year!' },
      ],
    },
    gallery: { title: 'Gallery', viewAll: 'View full gallery' },
    contact: {
      title: 'Contact Us',
      subtitle: 'We\'re ready to help you experience the best surf adventure.',
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

  useSEO({ title: t.seo.title, description: t.seo.description, lang })

  const { data: packages } = usePackages()
  const { data: galleryItems } = useGallery()
  const preview = galleryItems?.slice(0, 6) ?? []

  const [emblaRef] = useEmblaCarousel({ loop: true })

  return (
    <div className="min-h-screen bg-white font-body">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-ocean-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1600)' }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.h1
            className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t.hero.title}
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-ocean-200 sm:text-xl"
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
              className="flex items-center gap-2 rounded-full bg-green-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-green-400"
            >
              <MessageCircle size={20} />
              {t.hero.ctaWhatsapp}
            </a>
            <a
              href={mailHref}
              className="flex items-center gap-2 rounded-full border border-white/30 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              <Mail size={20} />
              {t.hero.ctaEmail}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <h2 className="font-display text-center text-3xl font-bold text-ocean-900 sm:text-4xl">
              {t.services.title}
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.items.map((svc, i) => (
              <FadeIn key={svc.title} delay={i * 0.1}>
                <div className="flex flex-col rounded-2xl border border-ocean-100 bg-white p-8 shadow-sm transition hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600">
                    <svc.icon size={24} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ocean-900">{svc.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{svc.description}</p>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ocean-600 hover:text-ocean-800"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Paquetes */}
      {packages && packages.length > 0 && (
        <section className="bg-ocean-50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn>
              <h2 className="font-display text-center text-3xl font-bold text-ocean-900 sm:text-4xl">
                {t.packages.title}
              </h2>
            </FadeIn>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg, i) => (
                <FadeIn key={pkg.id} delay={i * 0.1}>
                  <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm">
                    <h3 className="font-display text-xl font-semibold text-ocean-900">
                      {lang === 'es' ? pkg.name : pkg.name_en}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                      {lang === 'es' ? pkg.description : pkg.description_en}
                    </p>
                    <p className="mt-4 text-2xl font-bold text-ocean-700">
                      {formatPrice(pkg.price, pkg.currency)}
                    </p>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 flex items-center justify-center gap-2 rounded-full bg-ocean-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ocean-700"
                    >
                      <MessageCircle size={16} />
                      {t.packages.cta}
                    </a>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quiénes somos */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <h2 className="font-display text-center text-3xl font-bold text-ocean-900 sm:text-4xl">
              {t.about.title}
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <FadeIn>
              <div className="rounded-2xl bg-ocean-50 p-8">
                <h3 className="font-display text-lg font-semibold text-ocean-800">
                  {lang === 'es' ? 'Misión' : 'Mission'}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{t.about.mission}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-2xl bg-sand-50 p-8">
                <h3 className="font-display text-lg font-semibold text-sand-800">
                  {lang === 'es' ? 'Visión' : 'Vision'}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{t.about.vision}</p>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <div className="mt-8 rounded-2xl bg-coral-50 p-8">
              <h3 className="font-display text-lg font-semibold text-coral-800">{t.about.valuesTitle}</h3>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {t.about.values.map((v) => (
                  <li key={v} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="h-2 w-2 rounded-full bg-coral-500" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonios */}
      <section className="bg-ocean-950 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <h2 className="font-display text-center text-3xl font-bold text-white sm:text-4xl">
              {t.testimonials.title}
            </h2>
          </FadeIn>
          <div className="mt-12 overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {t.testimonials.items.map((item) => (
                <div key={item.name} className="min-w-0 flex-[0_0_100%] px-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%]">
                  <div className="h-full rounded-2xl bg-ocean-900 p-8">
                    <div className="mb-4 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-sand-400 text-sand-400" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-ocean-100">"{item.text}"</p>
                    <div className="mt-6">
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-ocean-400">{item.country}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Galería preview */}
      {preview.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn>
              <h2 className="font-display text-center text-3xl font-bold text-ocean-900 sm:text-4xl">
                {t.gallery.title}
              </h2>
            </FadeIn>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {preview.map((item, i) => (
                <GalleryPreviewItem key={item.id} item={item} index={i} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to={galleryHref}
                className="inline-flex items-center gap-2 rounded-full bg-ocean-600 px-8 py-3 font-semibold text-white transition hover:bg-ocean-700"
              >
                {t.gallery.viewAll}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contacto */}
      <section className="bg-ocean-50 py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-ocean-900 sm:text-4xl">{t.contact.title}</h2>
            <p className="mt-4 text-gray-600">{t.contact.subtitle}</p>
            <p className="mt-2 text-sm text-ocean-700 font-semibold">+{wa}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-green-500 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-green-400"
              >
                <MessageCircle size={20} />
                {t.contact.whatsapp}
              </a>
              <a
                href={mailHref}
                className="flex items-center gap-2 rounded-full border border-ocean-300 px-8 py-3 font-semibold text-ocean-700 transition hover:bg-ocean-100"
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

function GalleryPreviewItem({ item, index }: { item: { url: string; alt_text?: string; alt_text_en?: string }; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="aspect-square overflow-hidden rounded-xl bg-ocean-100"
    >
      <img
        src={item.url}
        alt={item.alt_text ?? ''}
        className="h-full w-full object-cover transition duration-300 hover:scale-105"
        loading="lazy"
      />
    </motion.div>
  )
}
