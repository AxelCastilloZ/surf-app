import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import type { GalleryCategory } from '@surf-app/types'
import { useGallery } from '../shared/hooks/useGallery'
import { useSEO } from '../shared/hooks/useSEO'
import Navbar from '../shared/components/Navbar'
import Footer from '../shared/components/Footer'

type Lang = 'es' | 'en'

const categories: { value: GalleryCategory | 'all'; label: { es: string; en: string } }[] = [
  { value: 'all', label: { es: 'Todos', en: 'All' } },
  { value: 'lessons', label: { es: 'Clases', en: 'Lessons' } },
  { value: 'trips', label: { es: 'Trips', en: 'Trips' } },
  { value: 'video_analysis', label: { es: 'Video Análisis', en: 'Video Analysis' } },
  { value: 'general', label: { es: 'General', en: 'General' } },
]

const i18n = {
  es: { title: 'Galería', description: 'Fotos y videos de nuestras clases y surf trips en Costa Rica.' },
  en: { title: 'Gallery', description: 'Photos and videos from our surf lessons and trips in Costa Rica.' },
}

export default function GalleryPage({ lang }: { lang: Lang }) {
  const t = i18n[lang]
  const [active, setActive] = useState<GalleryCategory | undefined>(undefined)
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  useSEO({ title: t.title, description: t.description, lang, path: lang === 'es' ? '/galeria' : '/en/gallery' })

  const { data: items = [], isLoading } = useGallery(active)
  const imageItems = items.filter((i) => i.media_type === 'image')
  const slides = imageItems.map((i) => ({ src: i.url, alt: (lang === 'es' ? i.alt_text : i.alt_text_en) ?? '' }))

  return (
    <div className="min-h-screen bg-white font-body">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="font-display text-center text-4xl font-bold text-ocean-900 sm:text-5xl">{t.title}</h1>

        {/* Category filters */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value === 'all' ? undefined : cat.value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                (cat.value === 'all' && !active) || cat.value === active
                  ? 'bg-ocean-600 text-white'
                  : 'border border-ocean-200 text-ocean-700 hover:bg-ocean-50'
              }`}
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="mt-16 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-ocean-600 border-t-transparent" />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {imageItems.map((item, idx) => (
              <GalleryGridItem
                key={item.id}
                src={item.url}
                alt={(lang === 'es' ? item.alt_text : item.alt_text_en) ?? ''}
                index={idx}
                onClick={() => setLightboxIndex(idx)}
              />
            ))}
          </div>
        )}
      </main>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        slides={slides}
        close={() => setLightboxIndex(-1)}
      />

      <Footer />
    </div>
  )
}

function GalleryGridItem({
  src, alt, index, onClick,
}: {
  src: string; alt: string; index: number; onClick: () => void
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04 }}
      className="aspect-square w-full overflow-hidden rounded-xl bg-ocean-100 focus:outline-none focus:ring-2 focus:ring-ocean-500"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition duration-300 hover:scale-105"
      />
    </motion.button>
  )
}
