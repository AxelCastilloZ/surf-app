import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'

@Entity('gallery_items')
export class GalleryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  url: string

  @Column({ type: 'text', nullable: true })
  storage_path: string | null

  @Column({ type: 'text', default: 'image' })
  media_type: string

  @Column({ type: 'text', default: 'general' })
  category: string

  @Column({ type: 'text', nullable: true })
  alt_text: string | null

  @Column({ type: 'text', nullable: true })
  alt_text_en: string | null

  @Column({ type: 'boolean', default: true })
  is_visible: boolean

  @Column({ type: 'integer', default: 0 })
  sort_order: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
