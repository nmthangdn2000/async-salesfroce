import { request } from '@/lib/api'
import type {
  CreateSourceSettingRequest,
  SourceSetting,
  UpdateSourceSettingRequest,
} from '@/types/source-setting'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Source Setting API Service
 * Tất cả các API calls liên quan đến Source Setting
 */
export const sourceSettingApi = {
  /**
   * Lấy source setting theo source ID
   * Returns null if not found (404)
   */
  getBySourceId: async (sourceId: string): Promise<SourceSetting | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/source-settings/source/${sourceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 404) {
        return null
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(
          typeof data.errorMessage === "string"
            ? data.errorMessage
            : typeof data.message === "string"
            ? data.message
            : "An error occurred"
        )
      }

      const data = await response.json()
      // Backend wraps response in { statusCode, data, message }
      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        "statusCode" in data
      ) {
        return data.data
      }
      return data
    } catch (error: any) {
      // If it's already a handled 404, return null
      if (error?.message?.includes('404')) {
        return null
      }
      throw error
    }
  },

  /**
   * Lấy source setting theo ID
   */
  getById: async (id: string): Promise<SourceSetting> => {
    return request<SourceSetting>(`/source-settings/${id}`, {
      method: 'GET',
    })
  },

  /**
   * Tạo source setting mới
   */
  create: async (
    data: CreateSourceSettingRequest,
  ): Promise<SourceSetting> => {
    return request<SourceSetting>('/source-settings', {
      method: 'POST',
      body: data,
    })
  },

  /**
   * Cập nhật source setting
   */
  update: async (
    id: string,
    data: UpdateSourceSettingRequest,
  ): Promise<SourceSetting> => {
    return request<SourceSetting>(`/source-settings/${id}`, {
      method: 'PATCH',
      body: data,
    })
  },

  /**
   * Xóa source setting
   */
  delete: async (id: string): Promise<void> => {
    return request<void>(`/source-settings/${id}`, {
      method: 'DELETE',
    })
  },
}

