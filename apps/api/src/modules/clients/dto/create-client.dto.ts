import { IsString, IsEmail, IsOptional, IsIn, MinLength } from 'class-validator'

export class CreateClientDto {
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

  @IsIn(['es', 'en'], { message: 'Idioma debe ser es o en' })
  @IsOptional()
  language?: string

  @IsString()
  @IsOptional()
  notes?: string
}
