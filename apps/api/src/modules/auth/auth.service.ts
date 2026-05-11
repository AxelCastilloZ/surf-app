import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { SupabaseService } from '../../common/supabase/supabase.service'
import type { AuthResponse, DashboardUser } from '@surf-app/types'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data: user, error } = await this.supabase.supabase
      .from('dashboard_users')
      .select('id, email, role, full_name, is_active, created_at, password_hash')
      .eq('email', dto.email.toLowerCase())
      .single()

    if (error || !user) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Cuenta desactivada. Contacta al administrador.')
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password_hash)
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const payload = { sub: user.id, email: user.email, role: user.role }
    const access_token = this.jwtService.sign(payload)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...safeUser } = user

    return { access_token, user: safeUser as DashboardUser }
  }

  async getMe(userId: string): Promise<DashboardUser> {
    const { data: user, error } = await this.supabase.supabase
      .from('dashboard_users')
      .select('id, email, role, full_name, is_active, created_at')
      .eq('id', userId)
      .single()

    if (error || !user) throw new UnauthorizedException()

    return user as DashboardUser
  }
}
