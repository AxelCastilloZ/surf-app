export type ServiceType = 'surf_lesson' | 'video_analysis' | 'surf_trip'

export type MediaType = 'image' | 'video'

export type GalleryCategory = 'lessons' | 'trips' | 'video_analysis' | 'general'

export interface GalleryItem {
  id: string
  url: string
  storage_path?: string   // ruta en Supabase Storage bucket 'gallery'
  media_type: MediaType
  category: GalleryCategory
  alt_text?: string
  alt_text_en?: string
  is_visible: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface Package {
  id: string
  name: string
  name_en: string
  description: string
  description_en: string
  price: number
  currency: string
  image_url?: string
  is_active: boolean
  sort_order: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// ── Auth / Dashboard users ────────────────────────────────

export type UserRole = 'superadmin' | 'admin'

export interface DashboardUser {
  id: string
  email: string
  role: UserRole
  full_name: string
  is_active: boolean
  created_at: string
}

export interface AuthResponse {
  access_token: string
  user: DashboardUser
}
