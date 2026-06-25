import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm'
import { Booking } from '../../bookings/entities/booking.entity'

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  full_name: string

  @Column({ type: 'text' })
  email: string

  @Column({ type: 'text', nullable: true })
  phone: string | null

  @Column({ type: 'text', nullable: true })
  country: string | null

  @Column({ type: 'text', default: 'es' })
  language: string

  @Column({ type: 'text', nullable: true })
  notes: string | null

  @OneToMany(() => Booking, (booking) => booking.client)
  bookings: Booking[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
