import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm'
import { Instructor } from './instructor.entity'
import { Booking } from '../../bookings/entities/booking.entity'

@Entity('instructor_reviews')
export class InstructorReview {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  instructor_id: string

  @ManyToOne(() => Instructor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instructor_id' })
  instructor: Instructor

  @Column({ type: 'uuid', unique: true })
  booking_id: string

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking

  @Column({ type: 'text' })
  client_name: string

  @Column({ type: 'integer' })
  rating: number

  @Column({ type: 'text', nullable: true })
  comment: string | null

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date
}
