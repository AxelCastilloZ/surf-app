import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { SupabaseService } from '../supabase/supabase.service'

export interface JwtPayload {
  sub: string
  email: string
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly supabase: SupabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    })
  }

  async validate(payload: JwtPayload) {
    const { data: user, error } = await this.supabase.supabase
      .from('dashboard_users')
      .select('id, email, role, full_name, is_active, created_at')
      .eq('id', payload.sub)
      .single()

    if (error || !user) throw new UnauthorizedException('Token inválido')
    if (!user.is_active) throw new UnauthorizedException('Cuenta desactivada')

    return user
  }
}
