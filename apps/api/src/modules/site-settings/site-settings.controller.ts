import {
  Controller, Get, Patch, Post,
  Param, Body, UseGuards,
  UseInterceptors, UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { SiteSettingsService } from './site-settings.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly service: SiteSettingsService) {}

  @Get(':key')
  get(@Param('key') key: string) {
    return this.service.get(key)
  }

  @Patch(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  update(@Param('key') key: string, @Body('value') value: string) {
    return this.service.update(key, value)
  }

  @Post('hero-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadHeroImage(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadHeroImage(file)
  }
}
