import { IsString, IsBoolean, IsNumber, IsOptional, IsIn } from 'class-validator'

export class CreateGalleryItemDto {
  @IsString()
  url!: string

  @IsIn(['image', 'video'])
  media_type!: 'image' | 'video'

  @IsIn(['lessons', 'trips', 'video_analysis', 'general'])
  category!: 'lessons' | 'trips' | 'video_analysis' | 'general'

  @IsString()
  @IsOptional()
  alt_text?: string

  @IsString()
  @IsOptional()
  alt_text_en?: string

  @IsBoolean()
  @IsOptional()
  is_visible?: boolean

  @IsNumber()
  @IsOptional()
  sort_order?: number
}
