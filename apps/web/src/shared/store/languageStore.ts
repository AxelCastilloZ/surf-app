import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageStore {
  lang: 'es' | 'en'
  setLang: (lang: 'es' | 'en') => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      lang: 'es',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'surf-app-lang' },
  ),
)
