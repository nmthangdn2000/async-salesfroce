import { request } from '@/lib/api'
import type { CreateSourceRequest, FilterSourceRequest, PaginatedSourceResponse, Source } from '@/types/source'

/**
 * Source API Service
 * Tất cả các API calls liên quan đến Source
 */
export const sourceApi = {
  /**
   * Lấy danh sách tất cả sources với pagination và filter
   */
  getAll: async (filter?: FilterSourceRequest): Promise<PaginatedSourceResponse> => {
    return request<PaginatedSourceResponse>('/sources', {
      method: 'GET',
      params: filter,
    })
  },

  /**
   * Lấy thông tin source theo ID
   */
  getById: async (id: string): Promise<Source> => {
    return request<Source>(`/sources/${id}`, {
      method: 'GET',
    })
  },

  /**
   * Tạo source mới
   */
  create: async (data: CreateSourceRequest): Promise<Source> => {
    return request<Source>('/sources', {
      method: 'POST',
      body: data,
    })
  },
}

