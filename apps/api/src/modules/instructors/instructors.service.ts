import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Instructor } from './entities/instructor.entity'
import { CreateInstructorDto } from './dto/create-instructor.dto'
import { UpdateInstructorDto } from './dto/update-instructor.dto'

const STORAGE_BUCKET = 'gallery'
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024

@Injectable()
export class InstructorsService {
  private readonly supabase: SupabaseClient

  constructor(
    @InjectRepository(Instructor)
    private readonly repo: Repository<Instructor>,
    private readonly config: ConfigService,
  ) {
    this.supabase = createClient(
      this.config.getOrThrow<string>('SUPABASE_URL'),
      this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
    )
  }

  async findAllPublic() {
    const data = await this.repo.find({
      where: { is_active: true },
      select: { id: true, full_name: true, email: true, photo_url: true, bio: true, is_active: true, created_at: true },
      order: { full_name: 'ASC' },
    })
    return { data }
  }

  async findOnePublic(id: string) {
    const instructor = await this.repo.findOne({
      where: { id, is_active: true },
      select: { id: true, full_name: true, email: true, photo_url: true, bio: true, is_active: true, created_at: true },
    })
    if (!instructor) throw new NotFoundException('Instructor no encontrado')
    return { data: instructor }
  }

  async findAll() {
    const data = await this.repo.find({
      order: { full_name: 'ASC' },
      relations: { dashboard_user: true },
    })
    const safe = data.map(({ dashboard_user, ...rest }) => ({
      ...rest,
      dashboard_user: dashboard_user
        ? { id: dashboard_user.id, email: dashboard_user.email, full_name: dashboard_user.full_name }
        : null,
    }))
    return { data: safe }
  }

  async findOne(id: string) {
    const instructor = await this.repo.findOne({
      where: { id },
      relations: { dashboard_user: true },
    })
    if (!instructor) throw new NotFoundException('Instructor no encontrado')
    return { data: instructor }
  }

  async create(dto: CreateInstructorDto) {
    const instructor = this.repo.create({
      ...dto,
      is_active: dto.is_active ?? true,
    })
    const saved = await this.repo.save(instructor)
    return { data: saved, message: 'Instructor creado' }
  }

  async update(id: string, dto: UpdateInstructorDto) {
    const instructor = await this.repo.findOne({ where: { id } })
    if (!instructor) throw new NotFoundException('Instructor no encontrado')

    await this.repo.update(id, dto)
    const updated = await this.repo.findOne({ where: { id }, relations: { dashboard_user: true } })
    return { data: updated, message: 'Instructor actualizado' }
  }

  async uploadPhoto(id: string, file: Express.Multer.File) {
    const instructor = await this.repo.findOne({ where: { id } })
    if (!instructor) throw new NotFoundException('Instructor no encontrado')

    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new BadRequestException('Formato no permitido. Usa JPG, PNG o WEBP.')
    }
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('La imagen no puede superar 10 MB.')
    }

    if (instructor.storage_path) {
      await this.supabase.storage.from(STORAGE_BUCKET).remove([instructor.storage_path])
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase() ?? 'jpg'
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const storagePath = `instructors/${safeName}`

    const { error: uploadError } = await this.supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file.buffer, { contentType: file.mimetype, upsert: false })

    if (uploadError) throw new BadRequestException(`Error al subir imagen: ${uploadError.message}`)

    const { data: publicUrlData } = this.supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath)

    instructor.photo_url = publicUrlData.publicUrl
    instructor.storage_path = storagePath
    await this.repo.save(instructor)

    return { data: instructor, message: 'Foto actualizada' }
  }

  async remove(id: string) {
    const instructor = await this.repo.findOne({ where: { id } })
    if (!instructor) throw new NotFoundException('Instructor no encontrado')

    if (instructor.storage_path) {
      await this.supabase.storage.from(STORAGE_BUCKET).remove([instructor.storage_path])
    }

    await this.repo.delete(id)
  }
}
