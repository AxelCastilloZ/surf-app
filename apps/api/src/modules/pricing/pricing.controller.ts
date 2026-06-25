import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common'
import { PricingService } from './pricing.service'
import { CreatePricingTierDto } from './dto/create-pricing-tier.dto'
import { UpdatePricingTierDto } from './dto/update-pricing-tier.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  // ── Public ──────────────────────────────────────────────
  @Get('estimate')
  estimate(
    @Query('service_type') serviceType: string,
    @Query('participants') participants: string,
  ) {
    return this.pricingService.estimate(serviceType, parseInt(participants, 10))
  }

  @Get('tiers/:serviceType')
  findByServiceType(@Param('serviceType') serviceType: string) {
    return this.pricingService.findByServiceType(serviceType)
  }

  // ── Admin ───────────────────────────────────────────────
  @Get('tiers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  findAll() {
    return this.pricingService.findAll()
  }

  @Post('tiers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  create(@Body() dto: CreatePricingTierDto) {
    return this.pricingService.create(dto)
  }

  @Patch('tiers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  update(@Param('id') id: string, @Body() dto: UpdatePricingTierDto) {
    return this.pricingService.update(id, dto)
  }

  @Delete('tiers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.pricingService.remove(id)
  }
}
