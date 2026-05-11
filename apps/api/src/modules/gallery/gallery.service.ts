import {
  Injectable, InternalServerErrorException,
  NotFoundException, BadRequestException,
} from '@nestjs/common'
import { SupabaseService } from '../../common/supabase/supabase.service'
import type { GalleryCategory, GalleryItem, ApiResponse } from '@surf-app/types'
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto'

const STORAGE_BUCKET = 'gallery'
const IMAGE_MAX_BYTES = 10 * 1024 * 1024  // 10 MB
const ALLOWED_MIMETYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'video/mp4', 'video/webm',
]

@Injectable()
export class GalleryService {
  constructor(private readonly supabase: SupabaseService) {}

  // ── Público: solo items visibles ────────────────────────────
  async findAll(category?: GalleryCategory): Promise<ApiResponse<GalleryItem[]>> {
    let query = this.supabase.supabase
      .from('gallery_items')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })

    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error) throw new InternalServerErrorException(error.message)
    return { data: data ?? [] }
  }

  // ── Admin: todos los items sin filtro ────────────────────────
  async findAllAdmin(category?: GalleryCategory): Promise<ApiResponse<GalleryItem[]>> {
    let query = this.supabase.supabase
      .from('gallery_items')
      .select('*')
      .order('sort_order', { ascending: true })

    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error) throw new InternalServerErrorException(error.message)
    return { data: data ?? [] }
  }

  async create(dto: CreateGalleryItemDto): Promise<ApiResponse<GalleryItem>> {
    const { data, error } = await this.supabase.supabase
      .from('gallery_items')
      .insert({ ...dto, is_visible: dto.is_visible ?? true, sort_order: dto.sort_order ?? 0 })
      .select()
      .single()

    if (error) throw new InternalServerErrorException(error.message)
    return { data, message: 'Item creado' }
  }

  async uploadFile(
    file: Express.Multer.File,
    category: string,
    alt_text?: string,
    alt_text_en?: string,
  ): Promise<ApiResponse<GalleryItem>> {
    if (!file) throw new BadRequestException('No se recibió ningún archivo')

    // Validar tipo MIME
    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido: ${file.mimetype}. Permitidos: JPEG, PNG, WEBP, MP4, WEBM`,
      )
    }

    // Validar tamaño: imágenes máx 10 MB, videos máx 50 MB (el limit del interceptor)
    const isVideo = file.mimetype.startsWith('video/')
    if (!isVideo && file.size > IMAGE_MAX_BYTES) {
      throw new BadRequestException(
        `Las imágenes no pueden superar 10 MB. Archivo recibido: ${(file.size / 1024 / 1024).toFixed(1)} MB`,
      )
    }

    const validCategories = ['lessons', 'trips', 'video_analysis', 'general']
    if (!validCategories.includes(category)) {
      throw new BadRequestException('Categoría inválida')
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase() ?? 'bin'
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const folder = isVideo ? 'videos' : 'images'
    const storagePath = `${folder}/${category}/${safeName}`

    // Subir a Supabase Storage
    const { error: storageError } = await this.supabase.supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      })

    if (storageError) throw new InternalServerErrorException(storageError.message)

    // Obtener URL pública
    const { data: { publicUrl } } = this.supabase.supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath)

    const mediaType = isVideo ? 'video' : 'image'

    // Guardar en tabla gallery_items con storage_path explícito
    const { data, error } = await this.supabase.supabase
      .from('gallery_items')
      .insert({
        url: publicUrl,
        storage_path: storagePath,
        media_type: mediaType,
        category,
        alt_text: alt_text ?? null,
        alt_text_en: alt_text_en ?? null,
        is_visible: true,
        sort_order: 0,
      })
      .select()
      .single()

    if (error) {
      // Si falla la inserción en DB, intentar limpiar Storage
      await this.supabase.supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
      throw new InternalServerErrorException(error.message)
    }

    return { data, message: 'Archivo subido correctamente' }
  }

  async update(id: string, dto: Partial<CreateGalleryItemDto>): Promise<ApiResponse<GalleryItem>> {
    const { data, error } = await this.supabase.supabase
      .from('gallery_items')
      .update(dto)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new InternalServerErrorException(error.message)
    if (!data) throw new NotFoundException('Item no encontrado')
    return { data, message: 'Item actualizado' }
  }

  async remove(id: string): Promise<void> {
    // Obtener storage_path de la tabla (fuente de verdad, no parsear la URL)
    const { data: item, error: fetchError } = await this.supabase.supabase
      .from('gallery_items')
      .select('storage_path')
      .eq('id', id)
      .single()

    if (fetchError || !item) throw new NotFoundException('Item no encontrado')

    // Eliminar de Supabase Storage si existe storage_path
    if (item.storage_path) {
      const { error: storageError } = await this.supabase.supabase.storage
        .from(STORAGE_BUCKET)
        .remove([item.storage_path])

      // Log pero no falla si Storage falla (podría estar ya eliminado)
      if (storageError) {
        console.warn(`[GalleryService] Storage delete warning for ${item.storage_path}:`, storageError.message)
      }
    }

    // Eliminar de la tabla
    const { error } = await this.supabase.supabase
      .from('gallery_items')
      .delete()
      .eq('id', id)

    if (error) throw new InternalServerErrorException(error.message)
  }
}
