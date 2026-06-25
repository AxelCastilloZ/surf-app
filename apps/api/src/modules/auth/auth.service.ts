import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { DashboardUser } from '../users/entities/dashboard-user.entity'
import type { AuthResponse, DashboardUser as DashboardUserType } from '@surf-app/types'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(DashboardUser)
    private readonly repo: Repository<DashboardUser>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.repo.findOne({
      where: { email: dto.email.toLowerCase() },
      select: { id: true, email: true, role: true, full_name: true, is_active: true, created_at: true, password_hash: true },
    })

    if (!user) throw new UnauthorizedException('Credenciales inválidas')
    if (!user.is_active) throw new UnauthorizedException('Cuenta desactivada. Contacta al administrador.')

    const passwordValid = await bcrypt.compare(dto.password, user.password_hash)
    if (!passwordValid) throw new UnauthorizedException('Credenciales inválidas')

    const payload = { sub: user.id, email: user.email, role: user.role }
    const access_token = this.jwtService.sign(payload)

    const { password_hash, ...safeUser } = user
    return { access_token, user: safeUser as unknown as DashboardUserType }
  }

  async getMe(userId: string): Promise<DashboardUserType> {
    const user = await this.repo.findOne({
      where: { id: userId },
      select: { id: true, email: true, role: true, full_name: true, is_active: true, created_at: true },
    })

    if (!user) throw new UnauthorizedException()
    return user as unknown as DashboardUserType
  }
}
