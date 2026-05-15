import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Video from 'yet-another-react-lightbox/plugins/video'
import 'yet-another-react-lightbox/styles.css'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Play } from 'lucide-react'
import type { GalleryItem, GalleryCategory } from '@surf-app/types'
import { useGallery } from '../shared/hooks/useGallery'
import { useSEO } from '../shared/hooks/useSEO'
import Navbar from '../shared/components/Navbar'
import Footer from '../shared/components/Footer'

type Lang = 'es' | 'en'

const CATEGORIES: { value: GalleryCategory | 'all'; label: { es: string; en: string } }[] = [
  { value: 'all',            label: { es: 'Todos',          en: 'All' } },
  { value: 'lessons',        label: { es: 'Clases',         en: 'Lessons' } },
  { value: 'trips',          label: { es: 'Trips',          en: 'Trips' } },
  { value: 'video_analysis', label: { es: 'Video Análisis', en: 'Video Analysis' } },
  { value: 'general',        label: { es: 'General',        en: 'General' } },
]

const i18n = {
  es: {
    title:       'Galería',
    subtitle:    'Fotos y videos de nuestras clases y surf trips en Costa Rica.',
    description: 'Galería de fotos y videos de clases de surf, trips y video análisis en Costa Rica.',
    empty:       'Próximamente — estamos añadiendo contenido a la galería.',
  },
  en: {
    title:       'Gallery',
    subtitle:    'Photos and videos from our surf lessons and trips in Costa Rica.',
    description: 'Gallery of photos and videos from surf lessons, trips and video analysis in Costa Rica.',
    empty:       'Coming soon — we are adding content to the gallery.',
  },
}

// Convierte los items al formato de slides para yet-another-react-lightbox
function toSlides(items: GalleryItem[], lang: Lang) {
  return items.map((item) => {
    const alt = (lang === 'es' ? item.alt_text : item.alt_text_en) ?? ''
    if (item.media_type === 'video') {
      return {
        type: 'video' as const,
        sources: [{ src: item.url, type: 'video/mp4' }],
        alt,
      }
    }
    return { src: item.url, alt }
  })
}

export default function GalleryPage({ lang }: { lang: Lang }) {
  const t = i18n[lang]
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | undefined>(undefined)
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  useSEO({
    title: t.title,
    description: t.description,
    lang,
    path: lang === 'es' ? '/galeria' : '/en/gallery',
  })

  const { data: items = [], isLoading } = useGallery(activeCategory)
  const slides = toSlides(items, lang)

  return (
    <div className="min-h-screen bg-white font-body text-slate-900">
      <Navbar />

      {/* Hero pequeño */}
      <section className="bg-mist-50 px-6 pb-10 pt-20 text-center">
        <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">{t.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">{t.subtitle}</p>
      </section>

      {/* Filtros de categoría */}
      <section className="bg-mist-50 border-b border-slate-200 py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => {
              const isActive =
                (cat.value === 'all' && !activeCategory) || cat.value === activeCategory
              return (
                <button
                  key={cat.value}
                  onClick={() =>
                    setActiveCategory(cat.value === 'all' ? undefined : (cat.value as GalleryCategory))
                  }
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-ocean-100 border border-ocean-500 text-ocean-600'
                      : 'border border-slate-300 text-slate-600 hover:border-ocean-500 hover:text-ocean-600'
                  }`}
                >
                  {cat.label[lang]}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          {isLoading ? (
            // Skeletons
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-slate-200/60" />
              ))}
            </div>
          ) : items.length === 0 ? (
            // Estado vacío
            <div className="py-24 text-center">
              <p className="text-slate-500 text-lg">{t.empty}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, idx) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={idx}
                  lang={lang}
                  onClick={() => setLightboxIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox con soporte de video */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        slides={slides}
        plugins={[Video]}
        close={() => setLightboxIndex(-1)}
      />

      <Footer />
    </div>
  )
}

function GalleryCard({
  item,
  index,
  lang,
  onClick,
}: {
  item: GalleryItem
  index: number
  lang: Lang
  onClick: () => void
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const isVideo = item.media_type === 'video'
  const alt = (lang === 'es' ? item.alt_text : item.alt_text_en) ?? ''

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 focus:outline-none shadow-sm hover:shadow-md transition-shadow"
    >
      <img
        src={item.url}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />

      {/* Overlay en hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Play overlay para videos */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition duration-300 group-hover:scale-110">
            <Play size={22} className="ml-1 text-white" fill="white" />
          </div>
        </div>
      )}

      {/* Badge de categoría en hover */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium capitalize text-ocean-700 backdrop-blur-sm">
          {item.category.replace('_', ' ')}
        </span>
      </div>
    </motion.button>
  )
}
