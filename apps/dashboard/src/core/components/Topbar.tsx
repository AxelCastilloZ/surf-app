import { useAuthStore } from '@/core/store/authStore'

export function Topbar() {
  const { user } = useAuthStore()

  return (
    <header className="flex h-14 shrink-0 items-center justify-end border-b border-slate-200 bg-white px-6">
      <p className="text-sm text-slate-500">
        Hola, <span className="font-medium text-slate-800">{user?.full_name}</span>
      </p>
    </header>
  )
}
