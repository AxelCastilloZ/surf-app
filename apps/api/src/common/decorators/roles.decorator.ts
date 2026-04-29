import { SetMetadata } from '@nestjs/common'

// TODO: Phase 2 — implement roles-based access control
export const ROLES_KEY = 'roles'
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
