import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InstructorsController } from './instructors.controller'
import { InstructorsService } from './instructors.service'
import { InstructorReviewsService } from './instructor-reviews.service'
import { Instructor } from './entities/instructor.entity'
import { InstructorReview } from './entities/instructor-review.entity'
import { Booking } from '../bookings/entities/booking.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Instructor, InstructorReview, Booking])],
  controllers: [InstructorsController],
  providers: [InstructorsService, InstructorReviewsService],
  exports: [InstructorsService],
})
export class InstructorsModule {}
