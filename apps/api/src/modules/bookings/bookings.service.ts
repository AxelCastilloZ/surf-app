import {
  Injectable, Logger, NotFoundException, BadRequestException,
  ConflictException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, LessThan } from 'typeorm'
import { Cron, CronExpression } from '@nestjs/schedule'
import { randomUUID } from 'crypto'
import { Booking } from './entities/booking.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
import { ClientsService } from '../clients/clients.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto'
import { AssignInstructorsDto } from './dto/assign-instructors.dto'
import { MailService } from '../mail/mail.service'
import { PricingService } from '../pricing/pricing.service'
import { ConfigService } from '@nestjs/config'

const TOKEN_EXPIRY_HOURS = 48

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name)

  constructor(
    @InjectRepository(Booking)
    private readonly repo: Repository<Booking>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
    private readonly clientsService: ClientsService,
    private readonly mailService: MailService,
    private readonly pricingService: PricingService,
    private readonly config: ConfigService,
  ) {}

  async createPublic(dto: CreateBookingDto) {
    const client = await this.clientsService.findOrCreateByEmail({
      full_name: dto.full_name,
      email: dto.email,
      phone: dto.phone,
      country: dto.country,
      language: dto.language,
    })

    const participants = dto.participants ?? 1
    const totalPrice = await this.pricingService.calculatePrice(dto.service_type, participants)

    const confirmationToken = randomUUID()
    const tokenExpiresAt = new Date()
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + TOKEN_EXPIRY_HOURS)

    const booking = this.repo.create({
      client_id: client.id,
      package_id: dto.package_id ?? null,
      service_type: dto.service_type,
      booking_date: dto.booking_date,
      start_time: dto.start_time,
      end_time: dto.end_time ?? null,
      participants,
      status: 'pending',
      total_price: totalPrice,
      currency: dto.currency ?? 'USD',
      medical_notes: dto.medical_notes,
      notes: dto.notes ?? null,
      confirmation_token: confirmationToken,
      token_expires_at: tokenExpiresAt,
    })

    const saved = await this.repo.save(booking)

    // If client chose a preferred instructor, link it
    if (dto.instructor_id) {
      const instructor = await this.instructorRepo.findOne({
        where: { id: dto.instructor_id, is_active: true },
      })
      if (instructor) {
        saved.instructors = [instructor]
        await this.repo.save(saved)
      }
    }

    const webUrl = this.config.get<string>('WEB_URL', 'http://localhost:5173')
    const confirmUrl = `${webUrl}/confirmar-reserva/${confirmationToken}`

    let instructorName: string | null = null
    if (dto.instructor_id) {
      const inst = await this.instructorRepo.findOne({
        where: { id: dto.instructor_id, is_active: true },
      })
      instructorName = inst?.full_name ?? null
    }

    const activeInstructors = await this.instructorRepo.find({
      where: { is_active: true },
      select: { full_name: true },
      order: { full_name: 'ASC' },
    })

    const emailData = {
      bookingId: saved.id,
      clientName: dto.full_name,
      clientEmail: dto.email,
      clientPhone: dto.phone,
      serviceName: dto.service_type,
      bookingDate: dto.booking_date,
      startTime: dto.start_time,
      participants,
      totalPrice,
      currency: dto.currency ?? 'USD',
      confirmUrl,
      instructorName,
      availableInstructors: activeInstructors.map(i => i.full_name),
    }

    console.log(`[BookingsService] Confirmation link for booking ${saved.id}: ${confirmUrl}`)
    this.mailService.sendBookingConfirmation(emailData).catch((err) => {
      console.error(`[BookingsService] Failed to send confirmation email:`, err?.message ?? err)
    })
    this.mailService.sendStaffNotification(emailData).catch((err) => {
      console.error(`[BookingsService] Failed to send staff notification:`, err?.message ?? err)
    })

    return {
      data: {
        id: saved.id,
        status: saved.status,
        confirmation_token: saved.confirmation_token,
        token_expires_at: saved.token_expires_at,
      },
      message: 'Reserva creada. Revisa tu email para confirmarla.',
    }
  }

  async confirmByToken(token: string) {
    const booking = await this.repo.findOne({
      where: { confirmation_token: token },
    })

    if (!booking) throw new NotFoundException('Token de confirmación inválido')
    if (booking.confirmed_at) throw new ConflictException('Esta reserva ya fue confirmada')
    if (booking.status === 'cancelled') throw new BadRequestException('Esta reserva fue cancelada')

    if (booking.token_expires_at && booking.token_expires_at < new Date()) {
      booking.status = 'expired'
      await this.repo.save(booking)
      throw new BadRequestException('El link de confirmación ha expirado. Realiza una nueva reserva.')
    }

    booking.status = 'confirmed'
    booking.confirmed_at = new Date()
    await this.repo.save(booking)

    return { data: { id: booking.id, status: booking.status }, message: 'Reserva confirmada exitosamente' }
  }

  async findAllAdmin(status?: string) {
    const qb = this.repo.createQueryBuilder('b')
      .leftJoinAndSelect('b.client', 'client')
      .leftJoinAndSelect('b.package', 'package')
      .leftJoinAndSelect('b.instructors', 'instructors')
      .orderBy('b.booking_date', 'DESC')
      .addOrderBy('b.start_time', 'ASC')

    if (status) qb.andWhere('b.status = :status', { status })

    const data = await qb.getMany()
    return { data }
  }

  async findOneAdmin(id: string) {
    const booking = await this.repo.findOne({
      where: { id },
      relations: { client: true, package: true, instructors: true },
    })
    if (!booking) throw new NotFoundException('Reserva no encontrada')
    return { data: booking }
  }

  async updateStatus(id: string, dto: UpdateBookingStatusDto) {
    const booking = await this.repo.findOne({
      where: { id },
      relations: { client: true, instructors: true },
    })
    if (!booking) throw new NotFoundException('Reserva no encontrada')

    if (booking.status === 'cancelled') {
      throw new BadRequestException('No se puede modificar una reserva cancelada')
    }
    if (booking.status === 'completed') {
      throw new BadRequestException('No se puede modificar una reserva completada')
    }

    booking.status = dto.status
    if (dto.internal_notes) booking.internal_notes = dto.internal_notes
    if (dto.cancelled_reason) booking.cancelled_reason = dto.cancelled_reason
    if (dto.status === 'confirmed' && !booking.confirmed_at) {
      booking.confirmed_at = new Date()
    }

    await this.repo.save(booking)

    if (dto.status === 'completed' && booking.client) {
      const lang = booking.client.language ?? 'es'
      const webUrl = this.config.get<string>('WEB_URL', 'http://localhost:5173')
      const instructor = booking.instructors?.[0] ?? null
      const reviewPath = instructor
        ? (lang === 'es' ? `/instructores/${instructor.id}` : `/en/instructors/${instructor.id}`)
        : (lang === 'es' ? '/' : '/en')

      this.mailService.sendBookingCompleted({
        clientName: booking.client.full_name,
        clientEmail: booking.client.email,
        serviceName: booking.service_type,
        bookingDate: booking.booking_date,
        instructorName: instructor?.full_name ?? null,
        reviewUrl: `${webUrl}${reviewPath}`,
        language: lang,
      }).catch(err => {
        this.logger.error(`Failed to send completion email for booking ${id}:`, err?.message ?? err)
      })
    }

    return { data: booking, message: `Reserva marcada como ${dto.status}` }
  }

  async assignInstructors(id: string, dto: AssignInstructorsDto) {
    const booking = await this.repo.findOne({
      where: { id },
      relations: { instructors: true },
    })
    if (!booking) throw new NotFoundException('Reserva no encontrada')

    if (dto.instructor_ids.length === 0) {
      booking.instructors = []
      await this.repo.save(booking)
      return { data: booking, message: 'Instructores removidos de la reserva' }
    }

    const instructors = await this.instructorRepo.find({
      where: { id: In(dto.instructor_ids) },
    })

    const foundIds = new Set(instructors.map(i => i.id))
    const missing = dto.instructor_ids.filter(id => !foundIds.has(id))
    if (missing.length > 0) {
      throw new NotFoundException(`Instructor(es) no encontrado(s): ${missing.join(', ')}`)
    }

    booking.instructors = instructors
    await this.repo.save(booking)

    const updated = await this.repo.findOne({
      where: { id },
      relations: { client: true, package: true, instructors: true },
    })

    return { data: updated, message: 'Instructores asignados correctamente' }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async expirePendingBookings() {
    const expired = await this.repo.find({
      where: { status: 'pending', token_expires_at: LessThan(new Date()) },
      relations: { client: true },
    })

    if (expired.length === 0) return

    await this.repo.update(
      expired.map(b => b.id),
      { status: 'expired' },
    )

    this.logger.log(`Expired ${expired.length} pending booking(s)`)

    const webUrl = this.config.get<string>('WEB_URL', 'http://localhost:5173')

    for (const booking of expired) {
      const lang = booking.client.language ?? 'es'
      const bookingUrl = lang === 'es' ? `${webUrl}/reservar` : `${webUrl}/en/book`

      this.mailService.sendBookingExpired({
        clientName: booking.client.full_name,
        clientEmail: booking.client.email,
        serviceName: booking.service_type,
        bookingDate: booking.booking_date,
        startTime: booking.start_time,
        bookingUrl,
        language: lang,
      }).catch(err => {
        this.logger.error(`Failed to send expiration email for booking ${booking.id}:`, err?.message ?? err)
      })
    }
  }
}
