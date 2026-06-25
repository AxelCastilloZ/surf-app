import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { DashboardUser } from './entities/dashboard-user.entity'
import type { ApiResponse, DashboardUser as DashboardUserType } from '@surf-app/types'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

const BCRYPT_ROUNDS = 12
const SAFE_SELECT = {
  id: true, email: true, role: true, full_name: true, is_active: true, created_at: true,
} as const

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(DashboardUser)
    private readonly repo: Repository<DashboardUser>,
  ) {}

  async findAll(): Promise<ApiResponse<DashboardUserType[]>> {
    const users = await this.repo.find({
      select: SAFE_SELECT,
      order: { created_at: 'DESC' },
    })
    return { data: users as unknown as DashboardUserType[] }
  }

  async create(dto: CreateUserDto): Promise<ApiResponse<DashboardUserType>> {
    const existing = await this.repo.findOne({
      where: { email: dto.email.toLowerCase() },
      select: { id: true },
    })
    if (existing) throw new ConflictException('Ya existe un usuario con ese email')

    const password_hash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS)

    const user = this.repo.create({
      full_name: dto.full_name,
      email: dto.email.toLowerCase(),
      password_hash,
      role: dto.role,
      is_active: true,
    })

    const saved = await this.repo.save(user)
    const { password_hash: _, ...safeUser } = saved
    return { data: safeUser as unknown as DashboardUserType, message: 'Usuario creado correctamente' }
  }

  async update(id: string, dto: UpdateUserDto): Promise<ApiResponse<DashboardUserType>> {
    const user = await this.repo.findOne({ where: { id }, select: SAFE_SELECT })
    if (!user) throw new NotFoundException('Usuario no encontrado')

    await this.repo.update(id, dto)
    const updated = await this.repo.findOne({ where: { id }, select: SAFE_SELECT })
    return { data: updated as unknown as DashboardUserType, message: 'Usuario actualizado' }
  }
}
