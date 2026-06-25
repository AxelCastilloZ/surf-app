import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Not } from 'typeorm'
import { ServicePricingTier } from './entities/service-pricing-tier.entity'
import { CreatePricingTierDto } from './dto/create-pricing-tier.dto'
import { UpdatePricingTierDto } from './dto/update-pricing-tier.dto'

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(ServicePricingTier)
    private readonly repo: Repository<ServicePricingTier>,
  ) {}

  async findAll() {
    const data = await this.repo.find({
      order: { service_type: 'ASC', min_participants: 'ASC' },
    })
    return { data }
  }

  async findByServiceType(serviceType: string) {
    const data = await this.repo.find({
      where: { service_type: serviceType, is_active: true },
      order: { min_participants: 'ASC' },
    })
    return { data }
  }

  async estimate(serviceType: string, participants: number) {
    const tier = await this.repo
      .createQueryBuilder('t')
      .where('t.service_type = :serviceType', { serviceType })
      .andWhere('t.is_active = true')
      .andWhere('t.min_participants <= :participants', { participants })
      .andWhere('t.max_participants >= :participants', { participants })
      .getOne()

    if (!tier) {
      throw new BadRequestException(
        `No tenemos tarifa configurada para ${participants} participante(s) en este servicio. Contáctanos directamente.`,
      )
    }

    const totalPrice = Number(tier.price_per_person) * participants

    return {
      data: {
        service_type: serviceType,
        participants,
        price_per_person: Number(tier.price_per_person),
        total_price: totalPrice,
        currency: 'USD',
      },
    }
  }

  async calculatePrice(serviceType: string, participants: number): Promise<number> {
    const { data } = await this.estimate(serviceType, participants)
    return data.total_price
  }

  async create(dto: CreatePricingTierDto) {
    if (dto.min_participants > dto.max_participants) {
      throw new BadRequestException('min_participants no puede ser mayor que max_participants')
    }

    await this.checkOverlap(dto.service_type, dto.min_participants, dto.max_participants)

    const tier = this.repo.create({
      ...dto,
      is_active: dto.is_active ?? true,
    })
    const saved = await this.repo.save(tier)
    return { data: saved, message: 'Tarifa creada' }
  }

  async update(id: string, dto: UpdatePricingTierDto) {
    const tier = await this.repo.findOne({ where: { id } })
    if (!tier) throw new NotFoundException('Tarifa no encontrada')

    const newMin = dto.min_participants ?? tier.min_participants
    const newMax = dto.max_participants ?? tier.max_participants

    if (newMin > newMax) {
      throw new BadRequestException('min_participants no puede ser mayor que max_participants')
    }

    await this.checkOverlap(tier.service_type, newMin, newMax, id)

    await this.repo.update(id, dto)
    const updated = await this.repo.findOne({ where: { id } })
    return { data: updated, message: 'Tarifa actualizada' }
  }

  async remove(id: string) {
    const result = await this.repo.delete(id)
    if (result.affected === 0) throw new NotFoundException('Tarifa no encontrada')
  }

  private async checkOverlap(
    serviceType: string,
    min: number,
    max: number,
    excludeId?: string,
  ) {
    const qb = this.repo
      .createQueryBuilder('t')
      .where('t.service_type = :serviceType', { serviceType })
      .andWhere('t.is_active = true')
      .andWhere('t.min_participants <= :max', { max })
      .andWhere('t.max_participants >= :min', { min })

    if (excludeId) {
      qb.andWhere('t.id != :excludeId', { excludeId })
    }

    const overlap = await qb.getOne()
    if (overlap) {
      throw new BadRequestException(
        `El rango ${min}-${max} se superpone con la tarifa existente (${overlap.min_participants}-${overlap.max_participants}) para ${serviceType}`,
      )
    }
  }
}
