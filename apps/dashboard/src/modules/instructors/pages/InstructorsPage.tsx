import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useInstructors } from '../hooks/useInstructors'
import { InstructorsTable } from '../components/InstructorsTable'
import { InstructorFormDialog } from '../components/InstructorFormDialog'
import { PageHeader } from '@/core/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function InstructorsPage() {
  const { data: instructors, isLoading } = useInstructors()
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div>
      <PageHeader
        title="Instructores"
        description="Administra los instructores de la escuela"
        action={
          <Button onClick={() => setShowCreate(true)} size="sm" className="gap-2">
            <Plus size={16} />
            Nuevo instructor
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <InstructorsTable instructors={instructors ?? []} />
      )}

      {showCreate && <InstructorFormDialog onClose={() => setShowCreate(false)} />}
    </div>
  )
}
