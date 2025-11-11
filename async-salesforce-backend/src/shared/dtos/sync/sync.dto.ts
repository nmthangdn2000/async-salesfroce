import {
  TBaseFilterRequestDto,
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import {
  SYNC_JOB_STATUS,
  SYNC_RUN_STATUS,
  TSyncJob,
  TSyncRun,
} from '@app/shared/models/sync.model';

// SyncJob DTOs
export type TFilterSyncJobRequestDto = TBaseFilterRequestDto & {
  sourceId?: string;
  targetId?: string;
  status?: SYNC_JOB_STATUS;
  type?: string;
};

export type TGetSyncJobResponseDto = TBaseModelResponseDto &
  Omit<
    TSyncJob,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'deletedBy'
    | 'source'
    | 'target'
    | 'syncRuns'
  > & {
    sourceId: string;
    targetId: string;
    syncRuns?: TGetSyncRunResponseDto[];
  };

export type TGetPaginatedSyncJobResponseDto =
  TBaseResponsePaginationDto<TGetSyncJobResponseDto>;

export type ICreateSyncJobRequestDto = Pick<
  TSyncJob,
  'sourceId' | 'targetId' | 'type' | 'scheduleCron' | 'status'
>;

export type IUpdateSyncJobRequestDto = Partial<ICreateSyncJobRequestDto>;

// SyncRun DTOs
export type TFilterSyncRunRequestDto = TBaseFilterRequestDto & {
  jobId?: string;
  status?: SYNC_RUN_STATUS;
  startedAtFrom?: Date;
  startedAtTo?: Date;
};

export type TGetSyncRunResponseDto = TBaseModelResponseDto &
  Omit<
    TSyncRun,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'deletedBy'
    | 'job'
  > & {
    jobId: string;
  };

export type TGetPaginatedSyncRunResponseDto =
  TBaseResponsePaginationDto<TGetSyncRunResponseDto>;

export type ICreateSyncRunRequestDto = Pick<
  TSyncRun,
  'jobId' | 'startedAt' | 'status'
> & {
  metrics?: Record<string, any>;
};

export type IUpdateSyncRunRequestDto = Partial<ICreateSyncRunRequestDto> & {
  finishedAt?: Date;
  status?: SYNC_RUN_STATUS;
  metrics?: Record<string, any>;
};
