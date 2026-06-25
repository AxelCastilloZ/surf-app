import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, HttpCode, HttpStatus, UseGuards,
  UseInterceptors, UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { InstructorsService } from './instructors.service'
import { InstructorReviewsService } from './instructor-reviews.service'
import { CreateInstructorDto } from './dto/create-instructor.dto'
import { UpdateInstructorDto } from './dto/update-instructor.dto'
import { CreateInstructorReviewDto } from './dto/create-instructor-review.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('instructors')
export class InstructorsController {
  constructor(
    private readonly instructorsService: InstructorsService,
    private readonly reviewsService: InstructorReviewsService,
  ) {}

  // ── Public ──────────────────────────────────────────────────

  @Get('public')
  findAllPublic() {
    return this.instructorsService.findAllPublic()
  }

  @Get('public/:id')
  findOnePublic(@Param('id') id: string) {
    return this.instructorsService.findOnePublic(id)
  }

  @Get(':id/reviews')
  findReviews(@Param('id') id: string) {
    return this.reviewsService.findByInstructor(id)
  }

  @Post(':id/reviews')
  createReview(@Param('id') id: string, @Body() dto: CreateInstructorReviewDto) {
    return this.reviewsService.create(id, dto)
  }

  // ── Admin ───────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  findAll() {
    return this.instructorsService.findAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  findOne(@Param('id') id: string) {
    return this.instructorsService.findOne(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  create(@Body() dto: CreateInstructorDto) {
    return this.instructorsService.create(dto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  update(@Param('id') id: string, @Body() dto: UpdateInstructorDto) {
    return this.instructorsService.update(id, dto)
  }

  @Post(':id/photo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadPhoto(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.instructorsService.uploadPhoto(id, file)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.instructorsService.remove(id)
  }
}
