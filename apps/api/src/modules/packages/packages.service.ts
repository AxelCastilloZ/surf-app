import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { SupabaseService } from '../../common/supabase/supabase.service'
import type { Package, ApiResponse } from '@surf-app/types'

@Injectable()
export class PackagesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<ApiResponse<Package[]>> {
    const { data, error } = await this.supabaseService.supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      throw new InternalServerErrorException(error.message)
    }

    return { data: data ?? [] }
  }
}
