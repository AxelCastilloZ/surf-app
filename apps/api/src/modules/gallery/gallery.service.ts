import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { SupabaseService } from '../../common/supabase/supabase.service'
import type { GalleryCategory, GalleryItem, ApiResponse } from '@surf-app/types'

@Injectable()
export class GalleryService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(category?: GalleryCategory): Promise<ApiResponse<GalleryItem[]>> {
    let query = this.supabaseService.supabase
      .from('gallery_items')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      throw new InternalServerErrorException(error.message)
    }

    return { data: data ?? [] }
  }
}
