import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm'

@Entity('site_settings')
export class SiteSetting {
  @PrimaryColumn({ type: 'text' })
  key: string

  @Column({ type: 'text' })
  value: string

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
