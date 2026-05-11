import { Injectable, InternalServerErrorException, ConflictException, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { SupabaseService } from '../../common/supabase/supabase.service'
import type { DashboardUser, ApiResponse } from '@surf-app/types'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

const BCRYPT_ROUNDS = 12
const SAFE_FIELDS = 'id, email, role, full_name, is_active, created_at'

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(): Promise<ApiResponse<DashboardUser[]>> {
    const { data, error } = await this.supabase.supabase
      .from('dashboard_users')
      .select(SAFE_FIELDS)
      .order('created_at', { ascending: false })

    if (error) throw new InternalServerErrorException(error.message)
    return { data: (data ?? []) as DashboardUser[] }
  }

  async create(dto: CreateUserDto): Promise<ApiResponse<DashboardUser>> {
    const { data: existing } = await this.supabase.supabase
      .from('dashboard_users')
      .select('id')
      .eq('email', dto.email.toLowerCase())
      .single()

    if (existing) throw new ConflictException('Ya existe un usuario con ese email')

    const password_hash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS)

    const { data, error } = await this.supabase.supabase
      .from('dashboard_users')
      .insert({
        full_name: dto.full_name,
        email: dto.email.toLowerCase(),
        password_hash,
        role: dto.role,
        is_active: true,
      })
      .select(SAFE_FIELDS)
      .single()

    if (error) throw new InternalServerErrorException(error.message)
    return { data: data as DashboardUser, message: 'Usuario creado correctamente' }
  }

  async update(id: string, dto: UpdateUserDto): Promise<ApiResponse<DashboardUser>> {
    const { data, error } = await this.supabase.supabase
      .from('dashboard_users')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(SAFE_FIELDS)
      .single()

    if (error) throw new InternalServerErrorException(error.message)
    if (!data) throw new NotFoundException('Usuario no encontrado')
    return { data: data as DashboardUser, message: 'Usuario actualizado' }
  }
}
