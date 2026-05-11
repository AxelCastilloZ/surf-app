import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator'

export class CreatePackageDto {
  @IsString()
  name!: string

  @IsString()
  name_en!: string

  @IsString()
  description!: string

  @IsString()
  description_en!: string

  @IsNumber()
  price!: number

  @IsString()
  @IsOptional()
  currency?: string

  @IsString()
  @IsOptional()
  image_url?: string

  @IsBoolean()
  @IsOptional()
  is_active?: boolean

  @IsNumber()
  @IsOptional()
  sort_order?: number
}
