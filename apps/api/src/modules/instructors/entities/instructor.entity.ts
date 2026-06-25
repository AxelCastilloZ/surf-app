import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, ManyToMany, JoinColumn,
} from 'typeorm'
import { DashboardUser } from '../../users/entities/dashboard-user.entity'
import { Booking } from '../../bookings/entities/booking.entity'

@Entity('instructors')
export class Instructor {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  full_name: string

  @Column({ type: 'text' })
  email: string

  @Column({ type: 'text', nullable: true })
  google_calendar_id: string | null

  @Column({ type: 'uuid', nullable: true })
  dashboard_user_id: string | null

  @ManyToOne(() => DashboardUser, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'dashboard_user_id' })
  dashboard_user: DashboardUser | null

  @Column({ type: 'text', nullable: true })
  photo_url: string | null

  @Column({ type: 'text', nullable: true })
  storage_path: string | null

  @Column({ type: 'text', nullable: true })
  bio: string | null

  @Column({ type: 'boolean', default: true })
  is_active: boolean

  @ManyToMany(() => Booking, (b) => b.instructors)
  bookings: Booking[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
