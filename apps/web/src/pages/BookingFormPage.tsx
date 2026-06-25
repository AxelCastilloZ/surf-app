import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2, CheckCircle, Mail, ChevronDown } from 'lucide-react'
import { useSEO } from '../shared/hooks/useSEO'
import Navbar from '../shared/components/Navbar'
import Footer from '../shared/components/Footer'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type Lang = 'es' | 'en'

const API_URL = import.meta.env.VITE_API_URL as string

const SERVICE_TYPES = ['surf_lesson', 'video_analysis', 'surf_trip'] as const

const BUSINESS_START = 6
const BUSINESS_END = 18

const TIME_OPTIONS: string[] = []
for (let h = BUSINESS_START; h < BUSINESS_END; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:00`)
  TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:30`)
}

const i18n = {
  es: {
    seo: { title: 'Reservar', description: 'Reserva tu clase de surf en Costa Rica.' },
    title: 'Reservar',
    subtitle: 'Completa el formulario para reservar tu experiencia.',
    service: {
      label: 'Tipo de servicio',
      placeholder: 'Selecciona un servicio',
      surf_lesson: 'Clase de Surf',
      video_analysis: 'Video Análisis',
      surf_trip: 'Surf Trip',
    },
    date: { label: 'Fecha' },
    time: { label: 'Hora', placeholder: 'Selecciona una hora' },
    instructor: {
      label: 'Instructor (opcional)',
      any: 'Sin preferencia',
    },
    name: { label: 'Nombre completo', placeholder: 'Tu nombre' },
    email: { label: 'Correo electrónico', placeholder: 'tu@email.com' },
    phone: { label: 'Teléfono', placeholder: '+506 8888 8888' },
    country: { label: 'País', placeholder: 'Selecciona tu país' },
    language: { label: 'Idioma preferido', es: 'Español', en: 'Inglés' },
    participants: { label: 'Participantes' },
    medical: {
      label: 'Condición médica que quieras contarnos',
      placeholder: 'Ninguna / Asma / Problemas de espalda / etc.',
      privacy: 'Esta información es confidencial y solo se usa para tu seguridad durante la clase.',
    },
    notes: { label: 'Notas adicionales (opcional)', placeholder: 'Algo que quieras que sepamos...' },
    price: {
      label: 'Precio estimado',
      perPerson: '/persona',
      total: 'Total',
      loading: 'Calculando...',
      noTier: 'No hay tarifa configurada para este número de participantes. Contáctanos directamente.',
    },
    policy: { label: 'He leído y acepto la', link: 'política de cancelación' },
    submit: 'Confirmar Reserva',
    submitting: 'Procesando...',
    success: {
      title: '¡Reserva Recibida!',
      message: 'Te hemos enviado un email de confirmación. Revisa tu bandeja de entrada (y spam) para confirmar tu reserva.',
      note: 'Tienes 48 horas para confirmar. Si no confirmas, la reserva se cancelará automáticamente.',
      home: 'Volver al inicio',
    },
    errors: {
      required: 'Este campo es obligatorio',
      email: 'Email inválido',
      pastDate: 'La fecha debe ser futura',
      policy: 'Debes aceptar la política de cancelación',
      server: 'Ocurrió un error. Intenta de nuevo.',
    },
  },
  en: {
    seo: { title: 'Book Now', description: 'Book your surf lesson in Costa Rica.' },
    title: 'Book Now',
    subtitle: 'Complete the form to book your experience.',
    service: {
      label: 'Service type',
      placeholder: 'Select a service',
      surf_lesson: 'Surf Lesson',
      video_analysis: 'Video Analysis',
      surf_trip: 'Surf Trip',
    },
    date: { label: 'Date' },
    time: { label: 'Time', placeholder: 'Select a time' },
    instructor: {
      label: 'Instructor (optional)',
      any: 'No preference',
    },
    name: { label: 'Full name', placeholder: 'Your name' },
    email: { label: 'Email', placeholder: 'you@email.com' },
    phone: { label: 'Phone', placeholder: '+1 555 123 4567' },
    country: { label: 'Country', placeholder: 'Select your country' },
    language: { label: 'Preferred language', es: 'Spanish', en: 'English' },
    participants: { label: 'Participants' },
    medical: {
      label: 'Any medical condition you want us to know about',
      placeholder: 'None / Asthma / Back problems / etc.',
      privacy: 'This information is confidential and only used for your safety during the lesson.',
    },
    notes: { label: 'Additional notes (optional)', placeholder: 'Anything you want us to know...' },
    price: {
      label: 'Estimated price',
      perPerson: '/person',
      total: 'Total',
      loading: 'Calculating...',
      noTier: 'No pricing available for this number of participants. Please contact us directly.',
    },
    policy: { label: "I've read and accept the", link: 'cancellation policy' },
    submit: 'Confirm Booking',
    submitting: 'Processing...',
    success: {
      title: 'Booking Received!',
      message: "We've sent you a confirmation email. Check your inbox (and spam) to confirm your booking.",
      note: 'You have 48 hours to confirm. If not confirmed, the booking will be cancelled automatically.',
      home: 'Back to home',
    },
    errors: {
      required: 'This field is required',
      email: 'Invalid email',
      pastDate: 'Date must be in the future',
      policy: 'You must accept the cancellation policy',
      server: 'An error occurred. Please try again.',
    },
  },
}

const COUNTRIES = [
  'Argentina', 'Australia', 'Brasil', 'Canada', 'Chile', 'Colombia',
  'Costa Rica', 'Ecuador', 'El Salvador', 'España', 'Estados Unidos',
  'Francia', 'Guatemala', 'Honduras', 'Israel', 'Italia', 'México',
  'Nicaragua', 'Panamá', 'Perú', 'Portugal', 'Puerto Rico',
  'República Dominicana', 'United Kingdom', 'Uruguay', 'Venezuela',
]

interface PublicInstructor {
  id: string
  full_name: string
}

function usePublicInstructors() {
  return useQuery({
    queryKey: ['instructors-public'],
    queryFn: async (): Promise<PublicInstructor[]> => {
      const res = await fetch(`${API_URL}/instructors/public`)
      if (!res.ok) throw new Error('Error loading instructors')
      const json = await res.json()
      return json.data ?? []
    },
    staleTime: 1000 * 60 * 5,
  })
}

function getTodayStr() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function BookingFormPage({ lang }: { lang: Lang }) {
  const t = i18n[lang]
  const [searchParams] = useSearchParams()
  const preselectedService = searchParams.get('service') as typeof SERVICE_TYPES[number] | null
  const preselectedInstructor = searchParams.get('instructor')
  const policyHref = lang === 'es' ? '/politicas' : '/en/policies'
  const homeHref = lang === 'es' ? '/' : '/en'

  useSEO({ title: t.seo.title, description: t.seo.description, lang, path: lang === 'es' ? '/reservar' : '/en/book' })

  const schema = useMemo(() => z.object({
    service_type: z.enum(SERVICE_TYPES, { required_error: t.errors.required }),
    booking_date: z.string().min(1, t.errors.required),
    start_time: z.string().min(1, t.errors.required),
    instructor_id: z.string().optional(),
    full_name: z.string().min(2, t.errors.required),
    email: z.string().email(t.errors.email),
    phone: z.string().optional(),
    country: z.string().optional(),
    language: z.enum(['es', 'en']).optional(),
    participants: z.number().int().min(1).default(1),
    medical_notes: z.string().min(1, t.errors.required),
    notes: z.string().optional(),
    accept_policy: z.literal(true, { errorMap: () => ({ message: t.errors.policy }) }),
  }), [t])

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      service_type: preselectedService && SERVICE_TYPES.includes(preselectedService) ? preselectedService : undefined,
      booking_date: '',
      start_time: '',
      instructor_id: preselectedInstructor ?? '',
      full_name: '',
      email: '',
      phone: '',
      country: '',
      language: lang,
      participants: 1,
      medical_notes: '',
      notes: '',
    },
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = form

  const { data: instructors } = usePublicInstructors()

  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const watchedService = form.watch('service_type')
  const watchedParticipants = form.watch('participants')

  const [priceEstimate, setPriceEstimate] = useState<{ price_per_person: number; total_price: number } | null>(null)
  const [priceLoading, setPriceLoading] = useState(false)
  const [priceError, setPriceError] = useState('')

  useEffect(() => {
    if (!watchedService || !watchedParticipants || watchedParticipants < 1) {
      setPriceEstimate(null)
      setPriceError('')
      return
    }

    const controller = new AbortController()
    setPriceLoading(true)
    setPriceError('')

    fetch(`${API_URL}/pricing/estimate?service_type=${watchedService}&participants=${watchedParticipants}`, {
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) return res.json().then(b => { throw new Error(b.message ?? 'Error') })
        return res.json()
      })
      .then(json => {
        setPriceEstimate(json.data)
        setPriceLoading(false)
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        setPriceEstimate(null)
        setPriceError(err.message ?? '')
        setPriceLoading(false)
      })

    return () => controller.abort()
  }, [watchedService, watchedParticipants])

  async function onSubmit(data: FormValues) {
    setServerError('')

    const body = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || undefined,
      country: data.country || undefined,
      language: data.language,
      service_type: data.service_type,
      booking_date: data.booking_date,
      start_time: data.start_time,
      participants: data.participants,
      medical_notes: data.medical_notes,
      notes: data.notes || undefined,
      instructor_id: data.instructor_id || undefined,
    }

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setServerError((json as { message?: string }).message ?? t.errors.server)
        return
      }

      setSubmitted(true)
    } catch {
      setServerError(t.errors.server)
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col bg-white font-body text-slate-900">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-20">
          <div className="w-full max-w-md text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
            <h1 className="mt-4 font-display text-3xl font-bold text-slate-900">{t.success.title}</h1>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-ocean-200 bg-ocean-50 p-4 text-left">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-ocean-600" />
              <p className="text-sm text-slate-700">{t.success.message}</p>
            </div>
            <p className="mt-4 text-sm text-slate-500">{t.success.note}</p>
            <Link
              to={homeHref}
              className="mt-8 inline-block rounded-full bg-ocean-500 px-8 py-3 font-semibold text-white transition hover:bg-ocean-600"
            >
              {t.success.home}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-body text-slate-900">
      <Navbar />

      <main className="flex-1 px-4 py-12 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">{t.title}</h1>
          <p className="mt-2 text-slate-600">{t.subtitle}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">

            {/* Service type */}
            <div className="space-y-2">
              <Label>{t.service.label}</Label>
              <div className="relative">
                <select
                  {...register('service_type')}
                  className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">{t.service.placeholder}</option>
                  {SERVICE_TYPES.map(st => (
                    <option key={st} value={st}>{t.service[st]}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              {errors.service_type && <p className="text-sm text-red-500">{errors.service_type.message}</p>}
            </div>

            {/* Date & Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t.date.label}</Label>
                <Input type="date" min={getTodayStr()} {...register('booking_date')} />
                {errors.booking_date && <p className="text-sm text-red-500">{errors.booking_date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>{t.time.label}</Label>
                <div className="relative">
                  <select
                    {...register('start_time')}
                    className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">{t.time.placeholder}</option>
                    {TIME_OPTIONS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                {errors.start_time && <p className="text-sm text-red-500">{errors.start_time.message}</p>}
              </div>
            </div>

            {/* Instructor (optional) */}
            {instructors && instructors.length > 0 && (
              <div className="space-y-2">
                <Label>{t.instructor.label}</Label>
                <div className="relative">
                  <select
                    {...register('instructor_id')}
                    className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">{t.instructor.any}</option>
                    {instructors.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.full_name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            )}

            <hr className="border-slate-200" />

            {/* Name & Email */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t.name.label}</Label>
                <Input {...register('full_name')} placeholder={t.name.placeholder} />
                {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>{t.email.label}</Label>
                <Input type="email" {...register('email')} placeholder={t.email.placeholder} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            {/* Phone & Country */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t.phone.label}</Label>
                <Input type="tel" {...register('phone')} placeholder={t.phone.placeholder} />
              </div>
              <div className="space-y-2">
                <Label>{t.country.label}</Label>
                <div className="relative">
                  <select
                    {...register('country')}
                    className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">{t.country.placeholder}</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Language & Participants */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t.language.label}</Label>
                <div className="relative">
                  <select
                    {...register('language')}
                    className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="es">{t.language.es}</option>
                    <option value="en">{t.language.en}</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.participants.label}</Label>
                <Input type="number" min={1} max={10} {...register('participants', { valueAsNumber: true })} />
                {errors.participants && <p className="text-sm text-red-500">{errors.participants.message}</p>}
              </div>
            </div>

            {/* Price estimate */}
            {(priceEstimate || priceLoading || priceError) && (
              <div className="rounded-xl border border-ocean-200 bg-ocean-50 p-4">
                {priceLoading ? (
                  <p className="text-sm text-slate-500">{t.price.loading}</p>
                ) : priceError ? (
                  <p className="text-sm text-amber-700">{priceError}</p>
                ) : priceEstimate ? (
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-sm text-slate-600">
                        ${priceEstimate.price_per_person.toFixed(2)}{t.price.perPerson}
                        {watchedParticipants > 1 && ` × ${watchedParticipants}`}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-ocean-700">
                      {t.price.total}: ${priceEstimate.total_price.toFixed(2)}
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Medical notes */}
            <div className="space-y-2">
              <Label>{t.medical.label} *</Label>
              <Textarea {...register('medical_notes')} placeholder={t.medical.placeholder} rows={2} />
              <p className="text-xs text-slate-400">{t.medical.privacy}</p>
              {errors.medical_notes && <p className="text-sm text-red-500">{errors.medical_notes.message}</p>}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>{t.notes.label}</Label>
              <Textarea {...register('notes')} placeholder={t.notes.placeholder} rows={2} />
            </div>

            {/* Policy */}
            <div className="space-y-1">
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  {...register('accept_policy')}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-ocean-600 focus:ring-ocean-500"
                />
                <span className="text-slate-600">
                  {t.policy.label}{' '}
                  <Link to={policyHref} className="font-medium text-ocean-600 underline hover:text-ocean-700" target="_blank">
                    {t.policy.link}
                  </Link>
                </span>
              </label>
              {errors.accept_policy && <p className="text-sm text-red-500">{errors.accept_policy.message}</p>}
            </div>

            {serverError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-coral-500 px-8 py-3 font-semibold text-white transition hover:bg-coral-600 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? t.submitting : t.submit}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
