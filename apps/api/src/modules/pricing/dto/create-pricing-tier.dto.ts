import { IsString, IsIn, IsInt, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator'

export class CreatePricingTierDto {
  @IsIn(['surf_lesson', 'video_analysis', 'surf_trip'], { message: 'Tipo de servicio inválido' })
  service_type: string

  @IsInt()
  @Min(1)
  min_participants: number

  @IsInt()
  @Min(1)
  max_participants: number

  @IsNumber()
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  price_per_person: number

  @IsBoolean()
  @IsOptional()
  is_active?: boolean
}
