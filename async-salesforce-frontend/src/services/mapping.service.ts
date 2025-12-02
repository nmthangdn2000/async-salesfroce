import { request } from '@/lib/api'
import type {
  CreateObjectMappingRequest,
  CreateFieldMappingRequest,
  BulkCreateFieldMappingRequest,
  UpdateObjectMappingRequest,
  UpdateFieldMappingRequest,
  FilterObjectMappingRequest,
  FilterFieldMappingRequest,
  PaginatedObjectMappingResponse,
  PaginatedFieldMappingResponse,
  ObjectMapping,
  FieldMapping,
} from '@/types/mapping'

/**
 * Mapping API Service
 * Tất cả các API calls liên quan đến Mappings
 */
export const mappingApi = {
  // Object Mapping methods
  /**
   * Lấy danh sách object mappings với pagination và filter
   */
  getObjectMappings: async (
    filter?: FilterObjectMappingRequest,
  ): Promise<PaginatedObjectMappingResponse> => {
    return request<PaginatedObjectMappingResponse>('/mappings/objects', {
      method: 'GET',
      params: filter,
    })
  },

  /**
   * Lấy object mapping theo ID
   */
  getObjectMappingById: async (id: string): Promise<ObjectMapping> => {
    return request<ObjectMapping>(`/mappings/objects/${id}`, {
      method: 'GET',
    })
  },

  /**
   * Tạo object mapping mới
   */
  createObjectMapping: async (
    data: CreateObjectMappingRequest,
  ): Promise<ObjectMapping> => {
    return request<ObjectMapping>('/mappings/objects', {
      method: 'POST',
      body: data,
    })
  },

  /**
   * Cập nhật object mapping
   */
  updateObjectMapping: async (
    id: string,
    data: UpdateObjectMappingRequest,
  ): Promise<ObjectMapping> => {
    return request<ObjectMapping>(`/mappings/objects/${id}`, {
      method: 'PATCH',
      body: data,
    })
  },

  /**
   * Xóa object mapping
   */
  deleteObjectMapping: async (id: string): Promise<void> => {
    return request<void>(`/mappings/objects/${id}`, {
      method: 'DELETE',
    })
  },

  // Field Mapping methods
  /**
   * Lấy danh sách field mappings với pagination và filter
   */
  getFieldMappings: async (
    filter?: FilterFieldMappingRequest,
  ): Promise<PaginatedFieldMappingResponse> => {
    return request<PaginatedFieldMappingResponse>('/mappings/fields', {
      method: 'GET',
      params: filter,
    })
  },

  /**
   * Lấy field mapping theo ID
   */
  getFieldMappingById: async (id: string): Promise<FieldMapping> => {
    return request<FieldMapping>(`/mappings/fields/${id}`, {
      method: 'GET',
    })
  },

  /**
   * Tạo field mapping mới
   */
  createFieldMapping: async (
    data: CreateFieldMappingRequest,
  ): Promise<FieldMapping> => {
    return request<FieldMapping>('/mappings/fields', {
      method: 'POST',
      body: data,
    })
  },

  /**
   * Bulk create field mappings
   */
  bulkCreateFieldMappings: async (
    data: BulkCreateFieldMappingRequest,
  ): Promise<FieldMapping[]> => {
    return request<FieldMapping[]>('/mappings/fields/bulk', {
      method: 'POST',
      body: data,
    })
  },

  /**
   * Cập nhật field mapping
   */
  updateFieldMapping: async (
    id: string,
    data: UpdateFieldMappingRequest,
  ): Promise<FieldMapping> => {
    return request<FieldMapping>(`/mappings/fields/${id}`, {
      method: 'PATCH',
      body: data,
    })
  },

  /**
   * Xóa field mapping
   */
  deleteFieldMapping: async (id: string): Promise<void> => {
    return request<void>(`/mappings/fields/${id}`, {
      method: 'DELETE',
    })
  },

  /**
   * Import field mappings from catalog fields
   * Automatically creates field mappings from selected catalog fields
   */
  importFieldMappingsFromCatalog: async (
    objectMappingId: string,
    catalogFieldIds: string[],
  ): Promise<FieldMapping[]> => {
    return request<FieldMapping[]>('/mappings/fields/import-from-catalog', {
      method: 'POST',
      body: {
        objectMappingId,
        catalogFieldIds,
      },
    })
  },
}

