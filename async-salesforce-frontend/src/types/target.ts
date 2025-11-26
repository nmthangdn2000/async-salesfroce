export enum TargetKind {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
  SQLSERVER = 'sqlserver',
  BIGQUERY = 'bigquery',
  SNOWFLAKE = 'snowflake',
  CLICKHOUSE = 'clickhouse',
  MONGODB = 'mongodb',
}

export interface Target {
  id: string
  projectId: string
  kind: TargetKind
  name: string
  // Connection fields (merged from target_connections)
  connectInfo?: Record<string, any>
  secretsRef?: string
  host?: string
  port?: number
  database?: string
  username?: string
  schema?: string
  ssl: boolean
  sslMode?: string
  connectionString?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTargetRequest {
  projectId: string
  kind: TargetKind
  name: string
  connectInfo?: Record<string, any>
  secretsRef?: string
  host?: string
  port?: number
  database?: string
  username?: string
  schema?: string
  ssl?: boolean
  sslMode?: string
  connectionString?: string
}

export interface FilterTargetRequest {
  page?: number
  take?: number
  projectId?: string
  search?: string
  kind?: TargetKind
}

export interface PaginatedTargetResponse {
  items: Target[]
  meta: {
    page: number
    take: number
    totalItems: number
    totalPages: number
    itemCount: number
  }
}

// Explicit exports for better module resolution
export type { Target, CreateTargetRequest, FilterTargetRequest, PaginatedTargetResponse }

