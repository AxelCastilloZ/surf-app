import { Separator } from '@/components/ui/separator'

interface Props {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: Props) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <Separator className="my-5" />
    </>
  )
}
