import { IsIn, IsString, IsOptional } from 'class-validator'

export class UpdateBookingStatusDto {
  @IsIn(['confirmed', 'completed', 'cancelled'], { message: 'Estado inválido' })
  status: string

  @IsString()
  @IsOptional()
  internal_notes?: string

  @IsString()
  @IsOptional()
  cancelled_reason?: string
}
