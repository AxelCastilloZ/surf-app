import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { DashboardUser } from '@surf-app/types'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): DashboardUser => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)
