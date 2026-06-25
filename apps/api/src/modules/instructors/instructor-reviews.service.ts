import {
  Injectable, NotFoundException, BadRequestException, ConflictException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InstructorReview } from './entities/instructor-review.entity'
import { Instructor } from './entities/instructor.entity'
import { Booking } from '../bookings/entities/booking.entity'
import { CreateInstructorReviewDto } from './dto/create-instructor-review.dto'

@Injectable()
export class InstructorReviewsService {
  constructor(
    @InjectRepository(InstructorReview)
    private readonly repo: Repository<InstructorReview>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  async findByInstructor(instructorId: string) {
    const instructor = await this.instructorRepo.findOne({
      where: { id: instructorId, is_active: true },
    })
    if (!instructor) throw new NotFoundException('Instructor no encontrado')

    const reviews = await this.repo.find({
      where: { instructor_id: instructorId },
      order: { created_at: 'DESC' },
    })

    const avg = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    return {
      data: reviews,
      meta: {
        count: reviews.length,
        average_rating: Math.round(avg * 10) / 10,
      },
    }
  }

  async create(instructorId: string, dto: CreateInstructorReviewDto) {
    const instructor = await this.instructorRepo.findOne({
      where: { id: instructorId, is_active: true },
    })
    if (!instructor) throw new NotFoundException('Instructor no encontrado')

    const booking = await this.bookingRepo.findOne({
      where: { id: dto.booking_id },
      relations: { instructors: true },
    })

    if (!booking) {
      throw new NotFoundException('No encontramos esa reserva. Verifica el ID e intenta de nuevo.')
    }

    if (booking.status !== 'completed') {
      throw new BadRequestException(
        'Solo puedes dejar una reseña después de que tu clase haya sido completada.',
      )
    }

    const isAssigned = booking.instructors.some(i => i.id === instructorId)
    if (!isAssigned) {
      throw new BadRequestException(
        'Esa reserva no corresponde a este instructor.',
      )
    }

    const existing = await this.repo.findOne({
      where: { booking_id: dto.booking_id },
    })
    if (existing) {
      throw new ConflictException('Ya existe una reseña para esta reserva.')
    }

    const client = await this.bookingRepo.findOne({
      where: { id: dto.booking_id },
      relations: { client: true },
    })

    const review = this.repo.create({
      instructor_id: instructorId,
      booking_id: dto.booking_id,
      client_name: client?.client?.full_name ?? 'Anónimo',
      rating: dto.rating,
      comment: dto.comment ?? null,
    })

    const saved = await this.repo.save(review)
    return { data: saved, message: 'Reseña publicada. ¡Gracias!' }
  }
}
