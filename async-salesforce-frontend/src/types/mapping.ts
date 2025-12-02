export enum PKStrategy {
  SF_ID = 'sf_id',
  CUSTOM = 'custom',
}

export interface ObjectMapping {
  id: string
  sourceId: string
  objectApiName: string
  targetId: string
  targetTable: string
  pkStrategy: PKStrategy
  fieldMappings?: FieldMapping[]
  createdAt: string
  updatedAt: string
}

export interface FieldMapping {
  id: string
  objectMappingId: string
  sfFieldApiName: string
  targetColumn: string
  logicalType: string
  targetTypeOverride?: string
  createdAt: string
  updatedAt: string
}

export interface CreateObjectMappingRequest {
  sourceId: string
  objectApiName: string
  targetId: string
  targetTable: string
  pkStrategy?: PKStrategy
}

export interface UpdateObjectMappingRequest {
  objectApiName?: string
  targetTable?: string
  pkStrategy?: PKStrategy
}

export interface CreateFieldMappingRequest {
  objectMappingId: string
  sfFieldApiName: string
  targetColumn: string
  logicalType: string
  targetTypeOverride?: string
}

export interface BulkCreateFieldMappingRequest {
  objectMappingId: string
  fieldMappings: Omit<CreateFieldMappingRequest, 'objectMappingId'>[]
}

export interface UpdateFieldMappingRequest {
  sfFieldApiName?: string
  targetColumn?: string
  logicalType?: string
  targetTypeOverride?: string
}

export interface FilterObjectMappingRequest {
  sourceId?: string
  targetId?: string
  search?: string
  page?: number
  take?: number
}

export interface FilterFieldMappingRequest {
  objectMappingId?: string
  search?: string
  page?: number
  take?: number
}

export interface PaginatedObjectMappingResponse {
  items: ObjectMapping[]
  meta: {
    page: number
    take: number
    itemCount: number
    totalItems: number
    totalPages: number
  }
}

export interface PaginatedFieldMappingResponse {
  items: FieldMapping[]
  meta: {
    page: number
    take: number
    itemCount: number
    totalItems: number
    totalPages: number
  }
}

