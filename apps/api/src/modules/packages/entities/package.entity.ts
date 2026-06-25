import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'text' })
  name_en: string

  @Column({ type: 'text', default: '' })
  description: string

  @Column({ type: 'text', default: '' })
  description_en: string

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number

  @Column({ type: 'text', default: 'USD' })
  currency: string

  @Column({ type: 'text', nullable: true })
  image_url: string | null

  @Column({ type: 'boolean', default: true })
  is_active: boolean

  @Column({ type: 'integer', default: 0 })
  sort_order: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
