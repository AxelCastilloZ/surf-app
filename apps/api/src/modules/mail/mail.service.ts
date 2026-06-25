import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'

interface BookingEmailData {
  bookingId: string
  clientName: string
  clientEmail: string
  clientPhone?: string | null
  serviceName: string
  bookingDate: string
  startTime: string
  participants: number
  totalPrice: number
  currency: string
  confirmUrl: string
  instructorName?: string | null
  availableInstructors?: string[]
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private readonly resend: Resend
  private readonly from: string
  private readonly staffEmail: string

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY', '')
    this.resend = new Resend(apiKey)
    this.from = this.config.get<string>('MAIL_FROM', 'onboarding@resend.dev')
    this.staffEmail = this.config.get<string>('STAFF_NOTIFY_EMAIL', '')
  }

  async sendBookingConfirmation(data: BookingEmailData): Promise<void> {
    if (!this.config.get<string>('RESEND_API_KEY')) {
      this.logger.warn('RESEND_API_KEY not set — skipping confirmation email')
      return
    }

    try {
      await this.resend.emails.send({
        from: this.from,
        to: data.clientEmail,
        subject: `Confirma tu reserva — ${this.serviceLabel(data.serviceName)}`,
        html: this.buildConfirmationHtml(data),
      })
      this.logger.log(`Confirmation email sent to ${data.clientEmail}`)
    } catch (err) {
      this.logger.error(`Failed to send confirmation email to ${data.clientEmail}:`, (err as Error).message)
    }
  }

  async sendStaffNotification(data: BookingEmailData): Promise<void> {
    if (!this.config.get<string>('RESEND_API_KEY') || !this.staffEmail) {
      this.logger.warn('RESEND_API_KEY or STAFF_NOTIFY_EMAIL not set — skipping staff notification')
      return
    }

    try {
      await this.resend.emails.send({
        from: this.from,
        to: this.staffEmail,
        subject: `Nueva reserva: ${data.clientName} — ${this.serviceLabel(data.serviceName)}`,
        html: this.buildStaffNotificationHtml(data),
      })
      this.logger.log(`Staff notification sent to ${this.staffEmail}`)
    } catch (err) {
      this.logger.error(`Failed to send staff notification:`, (err as Error).message)
    }
  }

  private serviceLabel(serviceType: string): string {
    const labels: Record<string, string> = {
      surf_lesson: 'Surf Lesson',
      video_analysis: 'Video Analysis',
      surf_trip: 'Surf Trip',
    }
    return labels[serviceType] ?? serviceType
  }

  private buildConfirmationHtml(data: BookingEmailData): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #0077b6;">Surfers Lab CR</h2>
  <p>Hola <strong>${data.clientName}</strong>,</p>
  <p>Recibimos tu reserva. Confirma haciendo clic en el botón:</p>

  <table style="margin: 24px 0; width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; color: #666;">Servicio</td><td style="padding: 8px 0;"><strong>${this.serviceLabel(data.serviceName)}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Fecha</td><td style="padding: 8px 0;"><strong>${data.bookingDate}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Hora</td><td style="padding: 8px 0;"><strong>${data.startTime}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Participantes</td><td style="padding: 8px 0;"><strong>${data.participants}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Total</td><td style="padding: 8px 0;"><strong>${data.currency} ${data.totalPrice}</strong></td></tr>${data.instructorName ? `
    <tr><td style="padding: 8px 0; color: #666;">Instructor</td><td style="padding: 8px 0;"><strong>${data.instructorName}</strong></td></tr>` : ''}
  </table>

  <a href="${data.confirmUrl}"
     style="display: inline-block; background: #0077b6; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold;">
    Confirmar reserva
  </a>

  <p style="margin-top: 24px; font-size: 13px; color: #999;">
    Este link expira en 48 horas. Si no realizaste esta reserva, puedes ignorar este email.
  </p>

  <p style="margin-top: 16px; padding: 12px; background: #f0f9ff; border-radius: 6px; font-size: 13px; color: #555;">
    Tu ID de reserva es: <strong style="font-family: monospace;">${data.bookingId}</strong><br>
    Guárdalo — lo necesitarás si deseas dejar una reseña a tu instructor después de la clase.
  </p>
</body>
</html>`
  }

  private buildStaffNotificationHtml(data: BookingEmailData): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #0077b6;">Nueva reserva recibida</h2>

  <table style="margin: 16px 0; width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; color: #666;">ID Reserva</td><td style="padding: 8px 0; font-family: monospace;">${data.bookingId}</td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Cliente</td><td style="padding: 8px 0;"><strong>${data.clientName}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${data.clientEmail}</td></tr>${data.clientPhone ? `
    <tr><td style="padding: 8px 0; color: #666;">Teléfono</td><td style="padding: 8px 0;"><a href="https://wa.me/${data.clientPhone.replace(/[^0-9]/g, '')}" style="color: #0077b6;">${data.clientPhone}</a></td></tr>` : ''}
    <tr><td style="padding: 8px 0; color: #666;">Servicio</td><td style="padding: 8px 0;"><strong>${this.serviceLabel(data.serviceName)}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Fecha</td><td style="padding: 8px 0;"><strong>${data.bookingDate}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Hora</td><td style="padding: 8px 0;"><strong>${data.startTime}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Participantes</td><td style="padding: 8px 0;">${data.participants}</td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Total</td><td style="padding: 8px 0;"><strong>${data.currency} ${data.totalPrice}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Instructor</td><td style="padding: 8px 0;"><strong>${data.instructorName ?? 'Sin preferencia'}</strong></td></tr>
  </table>${data.availableInstructors && data.availableInstructors.length > 0 ? `

  <div style="margin-top: 16px; padding: 12px; background: #fffbeb; border: 1px solid #fbbf24; border-radius: 6px;">
    <p style="margin: 0 0 8px; font-weight: bold; color: #92400e;">Instructores disponibles en ese horario:</p>
    <ul style="margin: 0; padding-left: 20px; color: #78350f;">
      ${data.availableInstructors.map((name) => `<li>${name}</li>`).join('\n      ')}
    </ul>
  </div>` : ''}

  <p style="margin-top: 16px; font-size: 13px; color: #999;">
    Estado: pendiente de confirmación por email del cliente.
  </p>
</body>
</html>`
  }
}
