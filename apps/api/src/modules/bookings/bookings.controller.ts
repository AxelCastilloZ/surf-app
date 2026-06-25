import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto'
import { AssignInstructorsDto } from './dto/assign-instructors.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  createPublic(@Body() dto: CreateBookingDto) {
    return this.bookingsService.createPublic(dto)
  }

  @Get('confirm/:token')
  confirmByToken(@Param('token') token: string) {
    return this.bookingsService.confirmByToken(token)
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  findAllAdmin(@Query('status') status?: string) {
    return this.bookingsService.findAllAdmin(status)
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  findOneAdmin(@Param('id') id: string) {
    return this.bookingsService.findOneAdmin(id)
  }

  @Patch('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, dto)
  }

  @Patch('admin/:id/instructors')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  assignInstructors(@Param('id') id: string, @Body() dto: AssignInstructorsDto) {
    return this.bookingsService.assignInstructors(id, dto)
  }
}
