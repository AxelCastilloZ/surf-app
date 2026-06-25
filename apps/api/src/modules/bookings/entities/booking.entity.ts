import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, ManyToMany, JoinColumn, JoinTable,
} from 'typeorm'
import { Client } from '../../clients/entities/client.entity'
import { Package } from '../../packages/entities/package.entity'
import { Instructor } from '../../instructors/entities/instructor.entity'

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  client_id: string

  @ManyToOne(() => Client, (c) => c.bookings, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'client_id' })
  client: Client

  @Column({ type: 'uuid', nullable: true })
  package_id: string | null

  @ManyToOne(() => Package, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'package_id' })
  package: Package | null

  @ManyToMany(() => Instructor, (i) => i.bookings, { cascade: false })
  @JoinTable({
    name: 'booking_instructors',
    joinColumn: { name: 'booking_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'instructor_id', referencedColumnName: 'id' },
  })
  instructors: Instructor[]

  @Column({ type: 'text' })
  service_type: string

  @Column({ type: 'date' })
  booking_date: string

  @Column({ type: 'time' })
  start_time: string

  @Column({ type: 'time', nullable: true })
  end_time: string | null

  @Column({ type: 'integer', default: 1 })
  participants: number

  @Column({ type: 'text', default: 'pending' })
  status: string

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total_price: number

  @Column({ type: 'text', default: 'USD' })
  currency: string

  @Column({ type: 'text', default: '' })
  medical_notes: string

  @Column({ type: 'text', nullable: true })
  notes: string | null

  @Column({ type: 'text', nullable: true })
  internal_notes: string | null

  @Column({ type: 'text', nullable: true })
  cancelled_reason: string | null

  @Column({ type: 'text', nullable: true, unique: true })
  confirmation_token: string | null

  @Column({ type: 'timestamptz', nullable: true })
  confirmed_at: Date | null

  @Column({ type: 'timestamptz', nullable: true })
  token_expires_at: Date | null

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
