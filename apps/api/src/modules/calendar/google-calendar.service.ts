import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { google, calendar_v3 } from 'googleapis'

export interface CalendarEvent {
  summary: string
  start: string
  end: string
}

export interface AvailabilityResult {
  available: boolean
  conflictingEvents: CalendarEvent[]
}

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name)
  private calendar: calendar_v3.Calendar | null = null

  constructor(private readonly config: ConfigService) {
    const clientEmail = this.config.get<string>('GOOGLE_SERVICE_ACCOUNT_EMAIL')
    const rawKey = this.config.get<string>('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY')

    if (!clientEmail || !rawKey) {
      this.logger.warn('Google Calendar credentials not configured — availability checks will be skipped')
      return
    }

    const privateKey = rawKey.replace(/\\n/g, '\n')

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    })

    this.calendar = google.calendar({ version: 'v3', auth })
  }

  async checkAvailability(
    calendarId: string,
    date: string,
    startTime: string,
    endTime?: string | null,
  ): Promise<AvailabilityResult> {
    if (!calendarId) {
      return { available: true, conflictingEvents: [] }
    }

    if (!this.calendar) {
      return { available: true, conflictingEvents: [] }
    }

    const defaultEnd = this.addHours(startTime, 2)
    const timeMin = `${date}T${startTime}:00-06:00`
    const timeMax = `${date}T${endTime ?? defaultEnd}:00-06:00`

    try {
      const res = await this.calendar.events.list({
        calendarId,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      })

      const events = (res.data.items ?? [])
        .filter(e => e.start && e.end)
        .map(e => ({
          summary: e.summary ?? '(Sin título)',
          start: e.start!.dateTime ?? e.start!.date ?? '',
          end: e.end!.dateTime ?? e.end!.date ?? '',
        }))

      return {
        available: events.length === 0,
        conflictingEvents: events,
      }
    } catch (err) {
      this.logger.error(
        `Failed to check calendar ${calendarId}: ${(err as Error).message}`,
      )
      return { available: true, conflictingEvents: [] }
    }
  }

  private addHours(time: string, hours: number): string {
    const [h, m] = time.split(':').map(Number)
    const newH = Math.min(h + hours, 23)
    return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }
}
