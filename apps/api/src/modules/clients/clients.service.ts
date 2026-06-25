import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Client } from './entities/client.entity'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly repo: Repository<Client>,
  ) {}

  async findAll() {
    const data = await this.repo.find({ order: { created_at: 'DESC' } })
    return { data }
  }

  async findOne(id: string) {
    const client = await this.repo.findOne({ where: { id } })
    if (!client) throw new NotFoundException('Cliente no encontrado')
    return { data: client }
  }

  async findOrCreateByEmail(dto: CreateClientDto): Promise<Client> {
    const existing = await this.repo.findOne({
      where: { email: dto.email.toLowerCase() },
    })
    if (existing) {
      if (dto.full_name) existing.full_name = dto.full_name
      if (dto.phone) existing.phone = dto.phone
      if (dto.country) existing.country = dto.country
      if (dto.language) existing.language = dto.language
      return this.repo.save(existing)
    }

    const client = this.repo.create({
      ...dto,
      email: dto.email.toLowerCase(),
      language: dto.language ?? 'es',
    })
    return this.repo.save(client)
  }

  async create(dto: CreateClientDto) {
    const client = this.repo.create({
      ...dto,
      email: dto.email.toLowerCase(),
      language: dto.language ?? 'es',
    })
    const saved = await this.repo.save(client)
    return { data: saved, message: 'Cliente creado' }
  }

  async update(id: string, dto: UpdateClientDto) {
    const client = await this.repo.findOne({ where: { id } })
    if (!client) throw new NotFoundException('Cliente no encontrado')

    if (dto.email) dto.email = dto.email.toLowerCase()
    await this.repo.update(id, dto)
    const updated = await this.repo.findOne({ where: { id } })
    return { data: updated, message: 'Cliente actualizado' }
  }

  async remove(id: string) {
    const result = await this.repo.delete(id)
    if (result.affected === 0) throw new NotFoundException('Cliente no encontrado')
  }
}
