import {
  Controller, Get, Post, Patch, Delete,
  Query, Param, Body, HttpCode, HttpStatus, UseGuards,
  UseInterceptors, UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { GalleryService } from './gallery.service'
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import type { GalleryCategory } from '@surf-app/types'

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  // ── Público: solo items visibles ─────────────────────────────
  @Get()
  findAll(@Query('category') category?: GalleryCategory) {
    return this.galleryService.findAll(category)
  }

  // ── Admin: todos los items (incluye no visibles) ─────────────
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  findAllAdmin(@Query('category') category?: GalleryCategory) {
    return this.galleryService.findAllAdmin(category)
  }

  // ── Protegidos (admin + superadmin) ──────────────────────────
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB máximo (videos)
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('category') category: string,
    @Body('alt_text') alt_text?: string,
    @Body('alt_text_en') alt_text_en?: string,
  ) {
    return this.galleryService.uploadFile(file, category, alt_text, alt_text_en)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  update(@Param('id') id: string, @Body() dto: Partial<CreateGalleryItemDto>) {
    return this.galleryService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id)
  }
}
