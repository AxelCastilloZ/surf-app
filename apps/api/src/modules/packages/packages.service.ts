import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { SupabaseService } from '../../common/supabase/supabase.service'
import type { Package, ApiResponse } from '@surf-app/types'
import { CreatePackageDto } from './dto/create-package.dto'

@Injectable()
export class PackagesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<ApiResponse<Package[]>> {
    const { data, error } = await this.supabaseService.supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw new InternalServerErrorException(error.message)
    return { data: data ?? [] }
  }

  async findAllAdmin(): Promise<ApiResponse<Package[]>> {
    const { data, error } = await this.supabaseService.supabase
      .from('packages')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw new InternalServerErrorException(error.message)
    return { data: data ?? [] }
  }

  async create(dto: CreatePackageDto): Promise<ApiResponse<Package>> {
    const { data, error } = await this.supabaseService.supabase
      .from('packages')
      .insert({ ...dto, currency: dto.currency ?? 'USD', is_active: dto.is_active ?? true, sort_order: dto.sort_order ?? 0 })
      .select()
      .single()

    if (error) throw new InternalServerErrorException(error.message)
    return { data, message: 'Package created' }
  }

  async update(id: string, dto: Partial<CreatePackageDto>): Promise<ApiResponse<Package>> {
    const { data, error } = await this.supabaseService.supabase
      .from('packages')
      .update(dto)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new InternalServerErrorException(error.message)
    if (!data) throw new NotFoundException('Package not found')
    return { data, message: 'Package updated' }
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabaseService.supabase
      .from('packages')
      .delete()
      .eq('id', id)

    if (error) throw new InternalServerErrorException(error.message)
  }
}
