import { request } from '@/lib/api'
import type {
  CreateSyncJobRequest,
  UpdateSyncJobRequest,
  TriggerSyncRequest,
  FilterSyncJobRequest,
  FilterSyncRunRequest,
  PaginatedSyncJobResponse,
  PaginatedSyncRunResponse,
  SyncJob,
  SyncRun,
} from '@/types/sync'

/**
 * Sync API Service
 * Tất cả các API calls liên quan đến Sync Jobs và Sync Runs
 */
export const syncApi = {
  // Sync Job methods
  /**
   * Lấy danh sách sync jobs với pagination và filter
   */
  getSyncJobs: async (
    filter?: FilterSyncJobRequest,
  ): Promise<PaginatedSyncJobResponse> => {
    return request<PaginatedSyncJobResponse>('/sync/jobs', {
      method: 'GET',
      params: filter,
    })
  },

  /**
   * Lấy sync job theo ID
   */
  getSyncJobById: async (id: string): Promise<SyncJob> => {
    return request<SyncJob>(`/sync/jobs/${id}`, {
      method: 'GET',
    })
  },

  /**
   * Tạo sync job mới
   */
  createSyncJob: async (data: CreateSyncJobRequest): Promise<SyncJob> => {
    return request<SyncJob>('/sync/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Cập nhật sync job
   */
  updateSyncJob: async (
    id: string,
    data: UpdateSyncJobRequest,
  ): Promise<SyncJob> => {
    return request<SyncJob>(`/sync/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /**
   * Xóa sync job
   */
  deleteSyncJob: async (id: string): Promise<void> => {
    return request<void>(`/sync/jobs/${id}`, {
      method: 'DELETE',
    })
  },

  /**
   * Trigger sync job manually
   */
  triggerSync: async (data: TriggerSyncRequest): Promise<SyncRun> => {
    return request<SyncRun>('/sync/trigger', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Sync Run methods
  /**
   * Lấy danh sách sync runs với pagination và filter
   */
  getSyncRuns: async (
    filter?: FilterSyncRunRequest,
  ): Promise<PaginatedSyncRunResponse> => {
    return request<PaginatedSyncRunResponse>('/sync/runs', {
      method: 'GET',
      params: filter,
    })
  },

  /**
   * Lấy sync run theo ID
   */
  getSyncRunById: async (id: string): Promise<SyncRun> => {
    return request<SyncRun>(`/sync/runs/${id}`, {
      method: 'GET',
    })
  },
}

