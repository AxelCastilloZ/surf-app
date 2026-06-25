import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Package } from './entities/package.entity'
import type { Package as PackageType, ApiResponse } from '@surf-app/types'
import { CreatePackageDto } from './dto/create-package.dto'

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly repo: Repository<Package>,
  ) {}

  async findAll(): Promise<ApiResponse<PackageType[]>> {
    const data = await this.repo.find({
      where: { is_active: true },
      order: { sort_order: 'ASC' },
    })
    return { data: data as unknown as PackageType[] }
  }

  async findAllAdmin(): Promise<ApiResponse<PackageType[]>> {
    const data = await this.repo.find({
      order: { sort_order: 'ASC' },
    })
    return { data: data as unknown as PackageType[] }
  }

  async create(dto: CreatePackageDto): Promise<ApiResponse<PackageType>> {
    const pkg = this.repo.create({
      ...dto,
      currency: dto.currency ?? 'USD',
      is_active: dto.is_active ?? true,
      sort_order: dto.sort_order ?? 0,
    })
    const saved = await this.repo.save(pkg)
    return { data: saved as unknown as PackageType, message: 'Package created' }
  }

  async update(id: string, dto: Partial<CreatePackageDto>): Promise<ApiResponse<PackageType>> {
    const pkg = await this.repo.findOne({ where: { id } })
    if (!pkg) throw new NotFoundException('Package not found')

    await this.repo.update(id, dto)
    const updated = await this.repo.findOne({ where: { id } })
    return { data: updated as unknown as PackageType, message: 'Package updated' }
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id)
    if (result.affected === 0) throw new NotFoundException('Package not found')
  }
}
