import {
  TBaseFilterRequestDto,
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import { SYNC_JOB_STATUS, SYNC_RUN_STATUS } from '@app/shared/models/sync.model';

// Sync Job DTOs
export type TFilterSyncJobRequestDto = TBaseFilterRequestDto & {
  sourceId?: string;
  targetId?: string;
  status?: SYNC_JOB_STATUS;
  search?: string;
};

export type TGetSyncJobResponseDto = TBaseModelResponseDto & {
  sourceId: string;
  targetId: string;
  type: string;
  scheduleCron?: string;
  status: SYNC_JOB_STATUS;
  lastRunAt?: Date;
  source?: {
    id: string;
    name: string;
    provider: string;
  };
  target?: {
    id: string;
    name: string;
    kind: string;
  };
  syncRuns?: TGetSyncRunResponseDto[];
};

export type TGetPaginatedSyncJobResponseDto =
  TBaseResponsePaginationDto<TGetSyncJobResponseDto>;

export type ICreateSyncJobRequestDto = {
  sourceId: string;
  targetId: string;
  type: string;
  scheduleCron?: string;
};

export type IUpdateSyncJobRequestDto = Partial<
  Omit<ICreateSyncJobRequestDto, 'sourceId' | 'targetId'>
> & {
  status?: SYNC_JOB_STATUS;
};

// Sync Run DTOs
export type TFilterSyncRunRequestDto = TBaseFilterRequestDto & {
  jobId?: string;
  status?: SYNC_RUN_STATUS;
  search?: string;
};

export type TGetSyncRunResponseDto = TBaseModelResponseDto & {
  jobId: string;
  startedAt: Date;
  finishedAt?: Date;
  status?: SYNC_RUN_STATUS;
  metrics?: Record<string, any>;
  job?: {
    id: string;
    sourceId: string;
    targetId: string;
    type: string;
  };
};

export type TGetPaginatedSyncRunResponseDto =
  TBaseResponsePaginationDto<TGetSyncRunResponseDto>;

// Trigger Sync DTO
export type ITriggerSyncRequestDto = {
  jobId: string;
};
