import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DashboardUser } from '../../modules/users/entities/dashboard-user.entity'

export interface JwtPayload {
  sub: string
  email: string
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(DashboardUser)
    private readonly repo: Repository<DashboardUser>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.repo.findOne({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, full_name: true, is_active: true, created_at: true },
    })

    if (!user) throw new UnauthorizedException('Token inválido')
    if (!user.is_active) throw new UnauthorizedException('Cuenta desactivada')

    return user
  }
}
