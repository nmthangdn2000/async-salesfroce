export enum SourceProvider {
  SALESFORCE = 'salesforce',
  HUBSPOT = 'hubspot',
  CUSTOM = 'custom',
}

export enum SourceEnvironment {
  PROD = 'prod',
  SANDBOX = 'sandbox',
  DEV = 'dev',
}

export enum SourceStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export interface Source {
  id: string
  projectId: string
  provider: SourceProvider
  name: string
  environment: SourceEnvironment
  status: SourceStatus
  createdAt: string
  updatedAt: string
}

export interface CreateSourceRequest {
  projectId: string
  provider: SourceProvider
  name: string
  environment?: SourceEnvironment
  status?: SourceStatus
}

export interface FilterSourceRequest {
  page?: number
  take?: number
  projectId?: string
  search?: string
  provider?: SourceProvider
  environment?: SourceEnvironment
  status?: SourceStatus
}

export interface PaginatedSourceResponse {
  items: Source[]
  meta: {
    page: number
    take: number
    totalItems: number
    totalPages: number
    itemCount: number
  }
}

// Explicit exports for better module resolution
export type { Source, CreateSourceRequest, FilterSourceRequest, PaginatedSourceResponse }

