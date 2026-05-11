import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserDto {
  @IsBoolean()
  @IsOptional()
  is_active?: boolean

  @IsString()
  @IsOptional()
  @MinLength(2)
  full_name?: string
}
