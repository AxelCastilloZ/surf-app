import { IsString, IsEmail, IsIn, IsDateString, IsInt, IsNumber, IsOptional, IsUUID, Min, MinLength, Matches } from 'class-validator'

export class CreateBookingDto {
  @IsString()
  @MinLength(2)
  full_name: string

  @IsEmail({}, { message: 'Email inválido' })
  email: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsString()
  @IsOptional()
  country?: string

  @IsIn(['es', 'en'])
  @IsOptional()
  language?: string

  @IsUUID()
  @IsOptional()
  package_id?: string

  @IsUUID()
  @IsOptional()
  instructor_id?: string

  @IsIn(['surf_lesson', 'video_analysis', 'surf_trip'], { message: 'Tipo de servicio inválido' })
  service_type: string

  @IsDateString({}, { message: 'Fecha inválida (formato YYYY-MM-DD)' })
  booking_date: string

  @Matches(/^\d{2}:\d{2}(:\d{2})?$/, { message: 'Formato de hora inválido (HH:MM)' })
  start_time: string

  @Matches(/^\d{2}:\d{2}(:\d{2})?$/, { message: 'Formato de hora inválido (HH:MM)' })
  @IsOptional()
  end_time?: string

  @IsInt()
  @Min(1)
  @IsOptional()
  participants?: number

  @IsNumber()
  @Min(0)
  @IsOptional()
  total_price?: number

  @IsString()
  @IsOptional()
  currency?: string

  @IsString()
  @MinLength(1, { message: 'Este campo es obligatorio' })
  medical_notes: string

  @IsString()
  @IsOptional()
  notes?: string
}
