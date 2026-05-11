import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'
import type { UserRole } from '@surf-app/types'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!roles || roles.length === 0) return true

    const { user } = context.switchToHttp().getRequest()
    if (!user) throw new ForbiddenException('Sin acceso')

    if (!roles.includes(user.role)) {
      throw new ForbiddenException('No tienes permisos para esta acción')
    }

    return true
  }
}
