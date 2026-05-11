import { SetMetadata } from '@nestjs/common'
import type { UserRole } from '@surf-app/types'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
