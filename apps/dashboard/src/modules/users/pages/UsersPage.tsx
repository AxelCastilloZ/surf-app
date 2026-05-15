import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useUsers } from '../hooks/useUsers'
import { UsersTable } from '../components/UsersTable'
import { UserFormDialog } from '../components/UserFormDialog'
import { PageHeader } from '@/core/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/core/store/authStore'

export function UsersPage() {
  const { data: users, isLoading } = useUsers()
  const currentUser = useAuthStore((s) => s.user)
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div>
      <PageHeader
        title="Usuarios"
        description="Administra los usuarios con acceso al panel"
        action={
          <Button onClick={() => setShowCreate(true)} size="sm" className="gap-2">
            <Plus size={16} />
            Nuevo usuario
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <UsersTable users={users ?? []} currentUserId={currentUser?.id ?? ''} />
      )}

      {showCreate && <UserFormDialog onClose={() => setShowCreate(false)} />}
    </div>
  )
}
