import type { Config } from '@react-router/dev/config'
import { vercelPreset } from '@vercel/react-router/vite'

export default {
  presets: [vercelPreset()],
  appDirectory: 'app',
  ssr: true,
  prerender: [
    '/',
    '/en',
    '/galeria',
    '/en/gallery',
    '/preguntas-frecuentes',
    '/en/faq',
    '/politicas',
    '/en/policies',
    '/blog',
    '/en/blog',
  ],
} satisfies Config
