import type { ServiceType } from '@surf-app/types'

export const MAX_FILE_SIZE_MB = 10

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

export const SERVICE_LABELS: Record<ServiceType, { es: string; en: string }> = {
  surf_lesson: { es: 'Clase de Surf', en: 'Surf Lesson' },
  video_analysis: { es: 'Video Análisis', en: 'Video Analysis' },
  surf_trip: { es: 'Surf Trip', en: 'Surf Trip' },
}

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}
