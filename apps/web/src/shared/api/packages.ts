import type { ApiResponse, Package } from '@surf-app/types'
import { apiFetch } from './client'

export function fetchPackages(): Promise<ApiResponse<Package[]>> {
  return apiFetch<ApiResponse<Package[]>>('/packages')
}
