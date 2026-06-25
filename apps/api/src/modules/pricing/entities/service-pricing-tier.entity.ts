import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('service_pricing_tiers')
export class ServicePricingTier {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  service_type: string

  @Column({ type: 'integer' })
  min_participants: number

  @Column({ type: 'integer' })
  max_participants: number

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price_per_person: number

  @Column({ type: 'boolean', default: true })
  is_active: boolean

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
