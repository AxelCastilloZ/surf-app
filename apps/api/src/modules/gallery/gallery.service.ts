import {
  Injectable, InternalServerErrorException,
  NotFoundException, BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SupabaseService } from '../../common/supabase/supabase.service'
import { GalleryItem } from './entities/gallery-item.entity'
import type { GalleryCategory, GalleryItem as GalleryItemType, ApiResponse } from '@surf-app/types'
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto'

const STORAGE_BUCKET = 'gallery'
const IMAGE_MAX_BYTES = 10 * 1024 * 1024  // 10 MB
const ALLOWED_MIMETYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'video/mp4', 'video/webm',
]

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(GalleryItem)
    private readonly repo: Repository<GalleryItem>,
    private readonly supabase: SupabaseService,
  ) {}

  async findAll(category?: GalleryCategory): Promise<ApiResponse<GalleryItemType[]>> {
    const where: Record<string, unknown> = { is_visible: true }
    if (category) where.category = category

    const data = await this.repo.find({
      where,
      order: { sort_order: 'ASC' },
    })
    return { data: data as unknown as GalleryItemType[] }
  }

  async findAllAdmin(category?: GalleryCategory): Promise<ApiResponse<GalleryItemType[]>> {
    const where: Record<string, unknown> = {}
    if (category) where.category = category

    const data = await this.repo.find({
      where,
      order: { sort_order: 'ASC' },
    })
    return { data: data as unknown as GalleryItemType[] }
  }

  async create(dto: CreateGalleryItemDto): Promise<ApiResponse<GalleryItemType>> {
    const item = this.repo.create({
      ...dto,
      is_visible: dto.is_visible ?? true,
      sort_order: dto.sort_order ?? 0,
    })
    const saved = await this.repo.save(item)
    return { data: saved as unknown as GalleryItemType, message: 'Item creado' }
  }

  async uploadFile(
    file: Express.Multer.File,
    category: string,
    alt_text?: string,
    alt_text_en?: string,
  ): Promise<ApiResponse<GalleryItemType>> {
    if (!file) throw new BadRequestException('No se recibió ningún archivo')

    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido: ${file.mimetype}. Permitidos: JPEG, PNG, WEBP, MP4, WEBM`,
      )
    }

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

    // Supabase Storage (se mantiene — Storage no es TypeORM)
    const { error: storageError } = await this.supabase.supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      })

    if (storageError) throw new InternalServerErrorException(storageError.message)

    const { data: { publicUrl } } = this.supabase.supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath)

    const mediaType = isVideo ? 'video' : 'image'

    const item = this.repo.create({
      url: publicUrl,
      storage_path: storagePath,
      media_type: mediaType,
      category,
      alt_text: alt_text ?? null,
      alt_text_en: alt_text_en ?? null,
      is_visible: true,
      sort_order: 0,
    })

    try {
      const saved = await this.repo.save(item)
      return { data: saved as unknown as GalleryItemType, message: 'Archivo subido correctamente' }
    } catch (err) {
      await this.supabase.supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
      throw new InternalServerErrorException((err as Error).message)
    }
  }

  async update(id: string, dto: Partial<CreateGalleryItemDto>): Promise<ApiResponse<GalleryItemType>> {
    const item = await this.repo.findOne({ where: { id } })
    if (!item) throw new NotFoundException('Item no encontrado')

    await this.repo.update(id, dto)
    const updated = await this.repo.findOne({ where: { id } })
    return { data: updated as unknown as GalleryItemType, message: 'Item actualizado' }
  }

  async remove(id: string): Promise<void> {
    const item = await this.repo.findOne({
      where: { id },
      select: { id: true, storage_path: true },
    })
    if (!item) throw new NotFoundException('Item no encontrado')

    if (item.storage_path) {
      const { error: storageError } = await this.supabase.supabase.storage
        .from(STORAGE_BUCKET)
        .remove([item.storage_path])

      if (storageError) {
        console.warn(`[GalleryService] Storage delete warning for ${item.storage_path}:`, storageError.message)
      }
    }

    await this.repo.delete(id)
  }
}
