import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

// TODO: Phase 2 — configure JWT strategy
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
