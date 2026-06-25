import { IsString, IsEmail, IsOptional, IsIn, MinLength } from 'class-validator'

export class UpdateClientDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  full_name?: string

  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsString()
  @IsOptional()
  country?: string

  @IsIn(['es', 'en'], { message: 'Idioma debe ser es o en' })
  @IsOptional()
  language?: string

  @IsString()
  @IsOptional()
  notes?: string
}
