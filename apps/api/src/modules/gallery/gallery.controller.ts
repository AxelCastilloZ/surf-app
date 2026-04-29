import { Controller, Get, Query } from '@nestjs/common'
import { GalleryService } from './gallery.service'
import { GalleryCategory } from '@surf-app/types'

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  findAll(@Query('category') category?: GalleryCategory) {
    return this.galleryService.findAll(category)
  }
}
