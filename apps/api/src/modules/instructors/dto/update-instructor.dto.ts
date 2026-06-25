import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID, MinLength } from 'class-validator'

export class UpdateInstructorDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  full_name?: string

  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  google_calendar_id?: string | null

  @IsUUID()
  @IsOptional()
  dashboard_user_id?: string | null

  @IsString()
  @IsOptional()
  bio?: string | null

  @IsBoolean()
  @IsOptional()
  is_active?: boolean
}
