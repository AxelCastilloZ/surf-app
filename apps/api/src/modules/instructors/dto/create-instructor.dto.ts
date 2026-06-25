import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID, MinLength } from 'class-validator'

export class CreateInstructorDto {
  @IsString()
  @MinLength(2)
  full_name: string

  @IsEmail({}, { message: 'Email inválido' })
  email: string

  @IsString()
  @IsOptional()
  google_calendar_id?: string

  @IsUUID()
  @IsOptional()
  dashboard_user_id?: string

  @IsString()
  @IsOptional()
  bio?: string

  @IsBoolean()
  @IsOptional()
  is_active?: boolean
}
