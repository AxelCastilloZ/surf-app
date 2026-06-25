import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BookingsController } from './bookings.controller'
import { BookingsService } from './bookings.service'
import { Booking } from './entities/booking.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
import { ClientsModule } from '../clients/clients.module'
import { MailModule } from '../mail/mail.module'
import { PricingModule } from '../pricing/pricing.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Instructor]),
    ClientsModule,
    MailModule,
    PricingModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
