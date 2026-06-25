import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { SiteSetting } from './entities/site-setting.entity'

const STORAGE_BUCKET = 'gallery'
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024

@Injectable()
export class SiteSettingsService {
  private readonly supabase: SupabaseClient

  constructor(
    @InjectRepository(SiteSetting)
    private readonly repo: Repository<SiteSetting>,
    private readonly config: ConfigService,
  ) {
    this.supabase = createClient(
      this.config.getOrThrow<string>('SUPABASE_URL'),
      this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
    )
  }

  async get(key: string) {
    const setting = await this.repo.findOne({ where: { key } })
    if (!setting) throw new NotFoundException(`Setting "${key}" no encontrada`)
    return { data: setting }
  }

  async update(key: string, value: string) {
    let setting = await this.repo.findOne({ where: { key } })
    if (!setting) {
      setting = this.repo.create({ key, value })
    } else {
      setting.value = value
    }
    await this.repo.save(setting)
    return { data: setting, message: 'Configuración actualizada' }
  }

  async uploadHeroImage(file: Express.Multer.File) {
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new BadRequestException('Formato no permitido. Usa JPG, PNG o WEBP.')
    }
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('La imagen no puede superar 10 MB.')
    }

    const existing = await this.repo.findOne({ where: { key: 'hero_storage_path' } })
    if (existing?.value) {
      await this.supabase.storage.from(STORAGE_BUCKET).remove([existing.value])
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase() ?? 'jpg'
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const storagePath = `site/${safeName}`

    const { error: uploadError } = await this.supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file.buffer, { contentType: file.mimetype, upsert: false })

    if (uploadError) throw new BadRequestException(`Error al subir imagen: ${uploadError.message}`)

    const { data: publicUrlData } = this.supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath)

    await this.update('hero_image_url', publicUrlData.publicUrl)
    await this.update('hero_storage_path', storagePath)

    return { data: { url: publicUrlData.publicUrl }, message: 'Imagen de hero actualizada' }
  }
}
