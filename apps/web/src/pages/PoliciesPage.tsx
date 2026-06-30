import { useSEO } from '../shared/hooks/useSEO'
import Navbar from '../shared/components/Navbar'
import Footer from '../shared/components/Footer'

type Lang = 'es' | 'en'

const i18n = {
  es: {
    seo: { title: 'Políticas', description: 'Políticas de cancelación y privacidad de Surfers Lab CR, escuela de surf en Nosara, Guanacaste.' },
    title: 'Políticas',
    cancellation: {
      title: 'Política de Cancelación',
      body: [
        'Las cancelaciones realizadas con más de 24 horas de anticipación recibirán un reembolso completo.',
        'Las cancelaciones con menos de 24 horas de anticipación no tienen derecho a reembolso.',
        'En caso de condiciones climáticas adversas o fuerza mayor, ofrecemos reprogramación sin costo adicional.',
        'Los cambios de fecha están sujetos a disponibilidad y deben solicitarse con al menos 12 horas de anticipación.',
      ],
    },
    privacy: {
      title: 'Política de Privacidad',
      body: [
        'Recopilamos únicamente los datos personales necesarios para brindar nuestros servicios (nombre, correo electrónico, número de teléfono).',
        'No vendemos, alquilamos ni compartimos tu información personal con terceros sin tu consentimiento explícito.',
        'Tus datos son almacenados de forma segura y utilizados únicamente para comunicaciones relacionadas con nuestros servicios.',
        'Puedes solicitar la eliminación de tus datos en cualquier momento escribiéndonos a nuestro correo de contacto.',
        'Utilizamos cookies técnicas necesarias para el funcionamiento del sitio. No utilizamos cookies de rastreo publicitario.',
      ],
    },
  },
  en: {
    seo: { title: 'Policies', description: 'Cancellation and privacy policies for Surfers Lab CR, surf school in Nosara, Guanacaste.' },
    title: 'Policies',
    cancellation: {
      title: 'Cancellation Policy',
      body: [
        'Cancellations made more than 24 hours in advance will receive a full refund.',
        'Cancellations made less than 24 hours in advance are not eligible for a refund.',
        'In case of adverse weather conditions or force majeure, we offer rescheduling at no extra cost.',
        'Date changes are subject to availability and must be requested at least 12 hours in advance.',
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      body: [
        'We only collect personal data necessary to provide our services (name, email address, phone number).',
        'We do not sell, rent, or share your personal information with third parties without your explicit consent.',
        'Your data is stored securely and used only for communications related to our services.',
        'You may request deletion of your data at any time by contacting us at our email address.',
        'We use technically necessary cookies required for the site to function. We do not use advertising tracking cookies.',
      ],
    },
  },
}

export default function PoliciesPage({ lang }: { lang: Lang }) {
  const t = i18n[lang]
  useSEO({
    title: t.seo.title,
    description: t.seo.description,
    lang,
    path: lang === 'es' ? '/politicas' : '/en/policies',
  })

  return (
    <div className="min-h-screen bg-white font-body text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-bold text-slate-900">{t.title}</h1>

        {/* Cancelación */}
        <section className="mt-12 rounded-2xl border border-slate-200 bg-mist-50 p-8">
          <h2 className="font-display text-2xl font-semibold text-ocean-600">{t.cancellation.title}</h2>
          <ul className="mt-5 space-y-4">
            {t.cancellation.body.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ocean-500" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Privacidad */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-mist-50 p-8">
          <h2 className="font-display text-2xl font-semibold text-ocean-600">{t.privacy.title}</h2>
          <ul className="mt-5 space-y-4">
            {t.privacy.body.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-coral-500" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}
