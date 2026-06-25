import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PricingController } from './pricing.controller'
import { PricingService } from './pricing.service'
import { ServicePricingTier } from './entities/service-pricing-tier.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ServicePricingTier])],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
