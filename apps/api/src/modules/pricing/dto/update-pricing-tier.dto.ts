import { IsInt, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator'

export class UpdatePricingTierDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  min_participants?: number

  @IsInt()
  @Min(1)
  @IsOptional()
  max_participants?: number

  @IsNumber()
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  @IsOptional()
  price_per_person?: number

  @IsBoolean()
  @IsOptional()
  is_active?: boolean
}
