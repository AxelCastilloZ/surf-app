import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { PackagesService } from './packages.service'
import { CreatePackageDto } from './dto/create-package.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  // ── Público ────────────────────────────────────────────
  @Get()
  findAll() {
    return this.packagesService.findAll()
  }

  // ── Protegidos (admin + superadmin) ───────────────────
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  create(@Body() dto: CreatePackageDto) {
    return this.packagesService.create(dto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  update(@Param('id') id: string, @Body() dto: Partial<CreatePackageDto>) {
    return this.packagesService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.packagesService.remove(id)
  }
}
