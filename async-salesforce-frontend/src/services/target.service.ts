import { request } from '@/lib/api'
import type { CreateTargetRequest, FilterTargetRequest, PaginatedTargetResponse, Target } from '@/types/target'

/**
 * Target API Service
 * Tất cả các API calls liên quan đến Target
 */
export const targetApi = {
  /**
   * Lấy danh sách tất cả targets với pagination và filter
   */
  getAll: async (filter?: FilterTargetRequest): Promise<PaginatedTargetResponse> => {
    return request<PaginatedTargetResponse>('/targets', {
      method: 'GET',
      params: filter,
    })
  },

  /**
   * Lấy thông tin target theo ID
   */
  getById: async (id: string): Promise<Target> => {
    return request<Target>(`/targets/${id}`, {
      method: 'GET',
    })
  },

  /**
   * Tạo target mới
   */
  create: async (data: CreateTargetRequest): Promise<Target> => {
    return request<Target>('/targets', {
      method: 'POST',
      body: data,
    })
  },
}

