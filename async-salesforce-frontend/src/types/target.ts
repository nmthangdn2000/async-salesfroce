export enum TargetKind {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
  SQLSERVER = 'sqlserver',
  BIGQUERY = 'bigquery',
  SNOWFLAKE = 'snowflake',
  CLICKHOUSE = 'clickhouse',
  MONGODB = 'mongodb',
}

export enum ConnectionType {
  HOST = 'host',
  URL = 'url',
}

export interface Target {
  id: string
  projectId: string
  sourceId: string
  kind: TargetKind
  name: string
  connectionType: ConnectionType
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
  sourceId: string
  kind: TargetKind
  name: string
  connectionType?: ConnectionType
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
  sourceId?: string
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

