import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Images, Package, Users, LogOut } from 'lucide-react'
import { useAuthStore } from '@/core/store/authStore'
import { RoleGate } from '@/core/guards/RoleGate'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/gallery', label: 'Galería', icon: Images, end: false },
  { to: '/dashboard/packages', label: 'Paquetes', icon: Package, end: false },
]

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const initials = user?.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?'

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 px-4">
        <img
          src="/assets/logo/logo.png"
          alt="Surfers Lab CR"
          className="h-7 w-auto"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling?.removeAttribute('style')
          }}
        />
        <span style={{ display: 'none' }} className="font-semibold text-slate-900">
          Surfers Lab CR
        </span>
        <Badge variant="secondary" className="text-xs">Admin</Badge>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        {/* Solo superadmin */}
        <RoleGate roles={['superadmin']}>
          <NavLink
            to="/dashboard/users"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Users size={16} />
            Usuarios
          </NavLink>
        </RoleGate>
      </nav>

      <Separator />

      {/* User footer */}
      <div className="p-3">
        <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-slate-800">{user?.full_name}</p>
            <p className="truncate text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-slate-500 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut size={14} />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
