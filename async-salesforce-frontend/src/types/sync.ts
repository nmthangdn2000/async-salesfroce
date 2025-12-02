export enum SyncJobStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  ERROR = 'error',
}

export enum SyncRunStatus {
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface SyncJob {
  id: string
  sourceId: string
  targetId: string
  type: string
  scheduleCron?: string
  status: SyncJobStatus
  lastRunAt?: string
  source?: {
    id: string
    name: string
    provider: string
  }
  target?: {
    id: string
    name: string
    kind: string
  }
  syncRuns?: SyncRun[]
  createdAt: string
  updatedAt: string
}

export interface SyncRun {
  id: string
  jobId: string
  startedAt: string
  finishedAt?: string
  status?: SyncRunStatus
  metrics?: Record<string, any>
  job?: {
    id: string
    sourceId: string
    targetId: string
    type: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateSyncJobRequest {
  sourceId: string
  targetId: string
  type: string
  scheduleCron?: string
}

export interface UpdateSyncJobRequest {
  type?: string
  scheduleCron?: string
  status?: SyncJobStatus
}

export interface TriggerSyncRequest {
  jobId: string
}

export interface FilterSyncJobRequest {
  sourceId?: string
  targetId?: string
  status?: SyncJobStatus
  search?: string
  page?: number
  take?: number
}

export interface FilterSyncRunRequest {
  jobId?: string
  status?: SyncRunStatus
  search?: string
  page?: number
  take?: number
}

export interface PaginatedSyncJobResponse {
  items: SyncJob[]
  meta: {
    page: number
    take: number
    itemCount: number
    totalItems: number
    totalPages: number
  }
}

export interface PaginatedSyncRunResponse {
  items: SyncRun[]
  meta: {
    page: number
    take: number
    itemCount: number
    totalItems: number
    totalPages: number
  }
}

