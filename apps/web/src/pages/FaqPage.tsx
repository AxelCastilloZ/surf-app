import { useMemo } from 'react'
import { useSEO, buildBreadcrumbs } from '../shared/hooks/useSEO'
import Navbar from '../shared/components/Navbar'
import Footer from '../shared/components/Footer'

type Lang = 'es' | 'en'

const faqData = {
  es: {
    seo: {
      title: 'Preguntas Frecuentes',
      description: 'Preguntas frecuentes sobre clases de surf, reservas, políticas y más en Surfers Lab CR, Nosara, Costa Rica.',
    },
    title: 'Preguntas Frecuentes',
    items: [
      {
        q: '¿Cómo reservo una clase de surf?',
        a: 'Puedes reservar directamente desde nuestro sitio web en la sección "Reservar". Selecciona el tipo de servicio, la fecha, el número de participantes y completa tus datos. Recibirás un correo de confirmación con todos los detalles.',
      },
      {
        q: '¿Cuál es la política de cancelación?',
        a: 'Las cancelaciones con más de 24 horas de anticipación reciben reembolso completo. Con menos de 24 horas no hay reembolso. En caso de mal clima, ofrecemos reprogramación sin costo.',
      },
      {
        q: '¿Qué debo llevar a mi clase de surf?',
        a: 'Solo necesitas traer protector solar biodegradable, traje de baño y una toalla. Nosotros proporcionamos la tabla de surf, el rash guard y todo el equipo necesario.',
      },
      {
        q: '¿Necesito experiencia previa para tomar clases?',
        a: 'No, nuestras clases están diseñadas para todos los niveles, desde principiantes absolutos hasta surfistas intermedios que quieren mejorar su técnica. Nuestros instructores adaptan la clase a tu nivel.',
      },
      {
        q: '¿Cuánto dura una clase de surf?',
        a: 'Las clases grupales y privadas tienen una duración aproximada de 1.5 a 2 horas, incluyendo calentamiento en tierra, instrucción en el agua y práctica libre.',
      },
      {
        q: '¿Dónde se ubica la escuela de surf?',
        a: 'Estamos en Playa Guiones, Nosara, Guanacaste, Costa Rica. Playa Guiones es reconocida mundialmente como una de las mejores playas para aprender surf por sus olas consistentes y fondo de arena.',
      },
      {
        q: '¿Cuál es el tamaño máximo de los grupos?',
        a: 'Mantenemos grupos pequeños con un máximo de 4-6 estudiantes por instructor para garantizar atención personalizada y seguridad en el agua.',
      },
      {
        q: '¿Los instructores están certificados?',
        a: 'Sí, todos nuestros instructores son surfistas experimentados con certificación ISA (International Surfing Association) y entrenamiento en primeros auxilios y rescate acuático.',
      },
    ],
  },
  en: {
    seo: {
      title: 'Frequently Asked Questions',
      description: 'Frequently asked questions about surf lessons, bookings, policies and more at Surfers Lab CR, Nosara, Costa Rica.',
    },
    title: 'Frequently Asked Questions',
    items: [
      {
        q: 'How do I book a surf lesson?',
        a: 'You can book directly from our website in the "Book" section. Select the type of service, date, number of participants, and fill in your details. You will receive a confirmation email with all the details.',
      },
      {
        q: 'What is the cancellation policy?',
        a: 'Cancellations made more than 24 hours in advance receive a full refund. Less than 24 hours, no refund is available. In case of bad weather, we offer free rescheduling.',
      },
      {
        q: 'What should I bring to my surf lesson?',
        a: 'Just bring biodegradable sunscreen, a swimsuit, and a towel. We provide the surfboard, rash guard, and all necessary equipment.',
      },
      {
        q: 'Do I need previous experience to take lessons?',
        a: 'No, our lessons are designed for all levels, from absolute beginners to intermediate surfers looking to improve their technique. Our instructors adapt the lesson to your level.',
      },
      {
        q: 'How long is a surf lesson?',
        a: 'Group and private lessons last approximately 1.5 to 2 hours, including warm-up on land, instruction in the water, and free practice.',
      },
      {
        q: 'Where is the surf school located?',
        a: 'We are located at Playa Guiones, Nosara, Guanacaste, Costa Rica. Playa Guiones is world-renowned as one of the best beaches to learn surfing due to its consistent waves and sandy bottom.',
      },
      {
        q: 'What is the maximum group size?',
        a: 'We keep groups small with a maximum of 4-6 students per instructor to ensure personalized attention and safety in the water.',
      },
      {
        q: 'Are the instructors certified?',
        a: 'Yes, all our instructors are experienced surfers with ISA (International Surfing Association) certification and training in first aid and water rescue.',
      },
    ],
  },
}

export default function FaqPage({ lang }: { lang: Lang }) {
  const t = faqData[lang]
  const faqPath = lang === 'es' ? '/preguntas-frecuentes' : '/en/faq'

  const schemas = useMemo(() => {
    const faqSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: t.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    }
    return [buildBreadcrumbs(faqPath, lang, t.title), faqSchema]
  }, [faqPath, lang, t])

  useSEO({
    title: t.seo.title,
    description: t.seo.description,
    lang,
    path: faqPath,
    schemas,
  })

  return (
    <div className="min-h-screen bg-white font-body text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-bold text-slate-900">{t.title}</h1>

        <div className="mt-10 space-y-4">
          {t.items.map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-slate-200 bg-mist-50 transition-colors open:bg-white open:shadow-sm"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left font-display text-lg font-semibold text-ocean-600 [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="shrink-0 text-2xl leading-none text-ocean-400 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed text-slate-600">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
