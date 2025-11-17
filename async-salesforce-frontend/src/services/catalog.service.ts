import { request } from '@/lib/api'

export interface SyncObjectsResponse {
  totalObjects: number
  syncedObjects: number
  updatedObjects: number
  createdObjects: number
  removedObjects: number
}

export interface SyncFieldsResponse {
  totalFields: number
  syncedFields: number
  updatedFields: number
  createdFields: number
  removedFields: number
}

export interface CatalogObject {
  id: string
  sourceId: string
  apiName: string
  label?: string
  isSelected: boolean
  selectedBy?: string
  selectedAt?: Date
  createdAt: string
  updatedAt: string
}

export interface CatalogField {
  id: string
  objectId: string
  apiName: string
  label?: string
  sfType: string
  isRequired?: boolean
  length?: number
  precision?: number
  scale?: number
  isSelected: boolean
  selectedBy?: string
  selectedAt?: Date
  createdAt: string
  updatedAt: string
}

export interface FilterCatalogObjectsRequest {
  sourceId?: string
  search?: string
  isSelected?: boolean
  page?: number
  take?: number
}

export interface FilterCatalogFieldsRequest {
  objectId?: string
  search?: string
  isSelected?: boolean
  sfType?: string
  page?: number
  take?: number
}

export interface PaginatedCatalogObjectsResponse {
  items: CatalogObject[]
  meta: {
    page: number
    take: number
    itemCount: number
    totalItems: number
    totalPages: number
  }
}

export interface PaginatedCatalogFieldsResponse {
  items: CatalogField[]
  meta: {
    page: number
    take: number
    itemCount: number
    totalItems: number
    totalPages: number
  }
}

/**
 * Catalog API Service
 * Tất cả các API calls liên quan đến Catalog
 */
export const catalogApi = {
  /**
   * Get all catalog objects from database
   */
  getObjects: async (
    filter?: FilterCatalogObjectsRequest,
  ): Promise<PaginatedCatalogObjectsResponse> => {
    return request<PaginatedCatalogObjectsResponse>('/catalog/objects', {
      method: 'GET',
      params: filter,
    })
  },

  /**
   * Sync all objects from Salesforce to catalog
   */
  syncObjects: async (sourceId: string): Promise<SyncObjectsResponse> => {
    return request<SyncObjectsResponse>(`/catalog/sync/${sourceId}`, {
      method: 'POST',
    })
  },

  /**
   * Get all catalog fields from database
   */
  getFields: async (
    filter?: FilterCatalogFieldsRequest,
  ): Promise<PaginatedCatalogFieldsResponse> => {
    return request<PaginatedCatalogFieldsResponse>('/catalog/fields', {
      method: 'GET',
      params: filter,
    })
  },

  /**
   * Sync all fields from Salesforce to catalog for a specific object
   */
  syncFields: async (objectId: string): Promise<SyncFieldsResponse> => {
    return request<SyncFieldsResponse>(`/catalog/fields/sync/${objectId}`, {
      method: 'POST',
    })
  },

  /**
   * Toggle selected status for an object
   */
  toggleObjectSelected: async (
    objectId: string,
    isSelected: boolean,
  ): Promise<CatalogObject> => {
    return request<CatalogObject>(`/catalog/objects/${objectId}/selected`, {
      method: 'PATCH',
      body: { isSelected },
    })
  },

  /**
   * Toggle selected status for a field
   */
  toggleFieldSelected: async (
    fieldId: string,
    isSelected: boolean,
  ): Promise<CatalogField> => {
    return request<CatalogField>(`/catalog/fields/${fieldId}/selected`, {
      method: 'PATCH',
      body: { isSelected },
    })
  },

  /**
   * Bulk update selected status for multiple fields
   */
  bulkUpdateFieldsSelected: async (
    fieldIds: string[],
    isSelected: boolean,
  ): Promise<{ updatedCount: number; skippedCount: number }> => {
    return request<{ updatedCount: number; skippedCount: number }>(
      '/catalog/fields/bulk-update-selected',
      {
        method: 'PATCH',
        body: { fieldIds, isSelected },
      },
    )
  },
}

