import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, MessageCircle, Mail } from 'lucide-react'
import { useSEO } from '../shared/hooks/useSEO'
import Navbar from '../shared/components/Navbar'
import Footer from '../shared/components/Footer'

type Lang = 'es' | 'en'

interface ConfirmResult {
  data: { id: string; status: string }
  message: string
}

const API_URL = import.meta.env.VITE_API_URL as string

const i18n = {
  es: {
    seo: {
      title: 'Confirmar Reserva',
      description: 'Confirma tu reserva en Surfers Lab CR.',
    },
    loading: 'Confirmando tu reserva...',
    success: {
      title: '¡Reserva Confirmada!',
      message: 'Tu reserva ha sido confirmada exitosamente. Nos vemos en el agua.',
      home: 'Volver al inicio',
    },
    expired: {
      title: 'Link Expirado',
      message: 'Este link de confirmación ha expirado o ya no es válido. Por favor contáctanos para reagendar tu reserva.',
    },
    error: {
      title: 'Error',
      message: 'No pudimos procesar tu confirmación. Por favor contáctanos directamente.',
    },
    contact: {
      whatsapp: 'Contactar por WhatsApp',
      email: 'Escribir por Email',
    },
  },
  en: {
    seo: {
      title: 'Confirm Booking',
      description: 'Confirm your booking at Surfers Lab CR.',
    },
    loading: 'Confirming your booking...',
    success: {
      title: 'Booking Confirmed!',
      message: 'Your booking has been confirmed successfully. See you in the water.',
      home: 'Back to home',
    },
    expired: {
      title: 'Link Expired',
      message: 'This confirmation link has expired or is no longer valid. Please contact us to reschedule your booking.',
    },
    error: {
      title: 'Error',
      message: "We couldn't process your confirmation. Please contact us directly.",
    },
    contact: {
      whatsapp: 'Contact via WhatsApp',
      email: 'Send an Email',
    },
  },
}

type Status = 'loading' | 'success' | 'expired' | 'error'

export default function ConfirmBookingPage({ lang }: { lang: Lang }) {
  const { token } = useParams<{ token: string }>()
  const t = i18n[lang]
  const [status, setStatus] = useState<Status>('loading')
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER as string
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL as string
  const homeHref = lang === 'es' ? '/' : '/en'

  useSEO({ title: t.seo.title, description: t.seo.description, lang, path: '/confirmar-reserva' })

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    fetch(`${API_URL}/bookings/confirm/${token}`)
      .then(async (res) => {
        if (res.ok) {
          setStatus('success')
        } else {
          const body = await res.json().catch(() => ({}))
          const msg = (body as { message?: string }).message ?? ''
          if (msg.includes('expirado') || msg.includes('expired') || msg.includes('cancelada') || res.status === 400) {
            setStatus('expired')
          } else {
            setStatus('error')
          }
        }
      })
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="flex min-h-screen flex-col bg-white font-body text-slate-900">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md text-center">

          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-ocean-500" />
              <p className="text-lg text-slate-600">{t.loading}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-emerald-500" />
              <h1 className="font-display text-3xl font-bold text-slate-900">{t.success.title}</h1>
              <p className="text-slate-600">{t.success.message}</p>
              <Link
                to={homeHref}
                className="mt-6 rounded-full bg-ocean-500 px-8 py-3 font-semibold text-white transition hover:bg-ocean-600"
              >
                {t.success.home}
              </Link>
            </div>
          )}

          {(status === 'expired' || status === 'error') && (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-16 w-16 text-coral-500" />
              <h1 className="font-display text-3xl font-bold text-slate-900">
                {status === 'expired' ? t.expired.title : t.error.title}
              </h1>
              <p className="text-slate-600">
                {status === 'expired' ? t.expired.message : t.error.message}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
                >
                  <MessageCircle size={18} />
                  {t.contact.whatsapp}
                </a>
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ocean-500 px-6 py-3 font-semibold text-ocean-600 transition hover:bg-ocean-50"
                >
                  <Mail size={18} />
                  {t.contact.email}
                </a>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
