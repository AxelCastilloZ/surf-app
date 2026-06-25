import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'

@Entity('dashboard_users')
export class DashboardUser {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text', unique: true })
  email: string

  @Column({ type: 'text' })
  password_hash: string

  @Column({ type: 'text', default: 'admin' })
  role: string

  @Column({ type: 'text' })
  full_name: string

  @Column({ type: 'boolean', default: true })
  is_active: boolean

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
