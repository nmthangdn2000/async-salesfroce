import { CustomHttpException } from '@app/common/exceptions/custom-http.exception';
import { ERROR_MESSAGES } from '@app/shared/constants/error.constant';
import {
  SYNC_JOB_STATUS,
  SYNC_RUN_STATUS,
} from '@app/shared/models/sync.model';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CreateSyncJobRequestDto } from './dto/requests/create-sync-job.dto';
import { FilterSyncJobRequestDto } from './dto/requests/filter-sync-job.dto';
import { FilterSyncRunRequestDto } from './dto/requests/filter-sync-run.dto';
import { UpdateSyncJobRequestDto } from './dto/requests/update-sync-job.dto';
import { GetPaginatedSyncJobResponseDto } from './dto/response/get-all-sync-job.dto';
import { GetPaginatedSyncRunResponseDto } from './dto/response/get-all-sync-run.dto';
import { GetOneSyncJobResponseDto } from './dto/response/get-one-sync-job.dto';
import { GetOneSyncRunResponseDto } from './dto/response/get-one-sync-run.dto';
import { SyncJobEntity } from './entities/sync-job.entity';
import { SyncRunEntity } from './entities/sync-run.entity';
import { SyncRepository } from './sync.repository';
import { SyncRunRepository } from './sync-run.repository';

@Injectable()
export class SyncService {
  constructor(
    private readonly syncRepository: SyncRepository,
    private readonly syncRunRepository: SyncRunRepository,
    private readonly syncJobRepo: SyncRepository,
    private readonly syncRunRepo: SyncRunRepository,
  ) {}

  // Sync Job methods
  async createSyncJob(
    createDto: CreateSyncJobRequestDto,
  ): Promise<SyncJobEntity> {
    // Check if job already exists for this source-target pair
    const existing = await this.syncJobRepo.findOne({
      where: {
        sourceId: createDto.sourceId,
        targetId: createDto.targetId,
      },
    });

    if (existing) {
      throw new CustomHttpException(ERROR_MESSAGES.SyncJobAlreadyExists);
    }

    const syncJob = this.syncJobRepo.create({
      sourceId: createDto.sourceId,
      targetId: createDto.targetId,
      type: createDto.type,
      scheduleCron: createDto.scheduleCron,
      status: SYNC_JOB_STATUS.IDLE,
    });

    return this.syncJobRepo.save(syncJob);
  }

  async updateSyncJob(
    id: string,
    updateDto: UpdateSyncJobRequestDto,
  ): Promise<SyncJobEntity> {
    const syncJob = await this.syncJobRepo.findOne({ where: { id } });

    if (!syncJob) {
      throw new CustomHttpException(ERROR_MESSAGES.SyncJobNotFound);
    }

    Object.assign(syncJob, updateDto);

    return this.syncJobRepo.save(syncJob);
  }

  async findSyncJobById(id: string): Promise<GetOneSyncJobResponseDto> {
    const syncJob = await this.syncJobRepo.findOne({
      where: { id },
      relations: ['source', 'target', 'syncRuns'],
    });

    if (!syncJob) {
      throw new CustomHttpException(ERROR_MESSAGES.SyncJobNotFound);
    }

    return plainToInstance(GetOneSyncJobResponseDto, {
      ...syncJob,
      source: syncJob.source
        ? {
            id: syncJob.source.id,
            name: syncJob.source.name,
            provider: syncJob.source.provider,
          }
        : undefined,
      target: syncJob.target
        ? {
            id: syncJob.target.id,
            name: syncJob.target.name,
            kind: syncJob.target.kind,
          }
        : undefined,
    });
  }

  async findAllSyncJobs(
    filter: FilterSyncJobRequestDto,
  ): Promise<GetPaginatedSyncJobResponseDto> {
    const query = this.syncJobRepo.createQueryBuilder('job');

    if (filter.sourceId) {
      query.andWhere('job.sourceId = :sourceId', {
        sourceId: filter.sourceId,
      });
    }

    if (filter.targetId) {
      query.andWhere('job.targetId = :targetId', {
        targetId: filter.targetId,
      });
    }

    if (filter.status) {
      query.andWhere('job.status = :status', { status: filter.status });
    }

    if (filter.search) {
      query.andWhere(
        '(job.type ILIKE :search OR job.scheduleCron ILIKE :search)',
        {
          search: `%${filter.search}%`,
        },
      );
    }

    query.leftJoinAndSelect('job.source', 'source');
    query.leftJoinAndSelect('job.target', 'target');

    const result = await this.syncRepository.paginate(
      query,
      filter,
      GetOneSyncJobResponseDto,
    );

    // Transform the result to include only necessary source/target fields
    const transformedItems = result.items.map((item) => ({
      ...item,
      source: item.source
        ? {
            id: item.source.id,
            name: item.source.name,
            provider: item.source.provider,
          }
        : undefined,
      target: item.target
        ? {
            id: item.target.id,
            name: item.target.name,
            kind: item.target.kind,
          }
        : undefined,
    }));

    return plainToInstance(GetPaginatedSyncJobResponseDto, {
      ...result,
      items: transformedItems,
    });
  }

  async deleteSyncJob(id: string): Promise<void> {
    const syncJob = await this.syncJobRepo.findOne({ where: { id } });

    if (!syncJob) {
      throw new CustomHttpException(ERROR_MESSAGES.SyncJobNotFound);
    }

    await this.syncJobRepo.remove(syncJob);
  }

  // Sync Run methods
  async triggerSync(jobId: string): Promise<SyncRunEntity> {
    const syncJob = await this.syncJobRepo.findOne({ where: { id: jobId } });

    if (!syncJob) {
      throw new CustomHttpException(ERROR_MESSAGES.SyncJobNotFound);
    }

    // Check if job is already running
    if (syncJob.status === SYNC_JOB_STATUS.RUNNING) {
      throw new CustomHttpException(ERROR_MESSAGES.SyncJobAlreadyRunning);
    }

    // Update job status to running
    syncJob.status = SYNC_JOB_STATUS.RUNNING;
    syncJob.lastRunAt = new Date();
    await this.syncJobRepo.save(syncJob);

    // Create a new sync run
    const syncRun = this.syncRunRepo.create({
      jobId: syncJob.id,
      startedAt: new Date(),
      status: SYNC_RUN_STATUS.RUNNING,
    });

    const savedRun = await this.syncRunRepo.save(syncRun);

    // TODO: Implement actual sync logic here
    // For now, we'll simulate it by updating the run status after a delay
    // In production, this should be handled by a queue/worker system
    void (async () => {
      try {
        // Simulate sync process
        // In real implementation, this would:
        // 1. Fetch data from Salesforce based on object mappings
        // 2. Transform data according to field mappings
        // 3. Insert/update data in target database
        // 4. Update metrics

        const updatedRun = await this.syncRunRepo.findOne({
          where: { id: savedRun.id },
        });

        if (updatedRun) {
          updatedRun.status = SYNC_RUN_STATUS.SUCCESS;
          updatedRun.finishedAt = new Date();
          updatedRun.metrics = {
            recordsProcessed: 0,
            recordsInserted: 0,
            recordsUpdated: 0,
            errors: [],
          };
          await this.syncRunRepo.save(updatedRun);
        }

        // Update job status back to idle
        const updatedJob = await this.syncJobRepo.findOne({
          where: { id: jobId },
        });
        if (updatedJob) {
          updatedJob.status = SYNC_JOB_STATUS.IDLE;
          await this.syncJobRepo.save(updatedJob);
        }
      } catch (error) {
        // Handle error
        const errorRun = await this.syncRunRepo.findOne({
          where: { id: savedRun.id },
        });
        if (errorRun) {
          errorRun.status = SYNC_RUN_STATUS.FAILED;
          errorRun.finishedAt = new Date();
          errorRun.metrics = {
            error: error instanceof Error ? error.message : 'Unknown error',
          };
          await this.syncRunRepo.save(errorRun);
        }

        const errorJob = await this.syncJobRepo.findOne({
          where: { id: jobId },
        });
        if (errorJob) {
          errorJob.status = SYNC_JOB_STATUS.ERROR;
          await this.syncJobRepo.save(errorJob);
        }
      }
    })();

    return savedRun;
  }

  async findAllSyncRuns(
    filter: FilterSyncRunRequestDto,
  ): Promise<GetPaginatedSyncRunResponseDto> {
    const query = this.syncRunRepo.createQueryBuilder('run');

    if (filter.jobId) {
      query.andWhere('run.jobId = :jobId', { jobId: filter.jobId });
    }

    if (filter.status) {
      query.andWhere('run.status = :status', { status: filter.status });
    }

    if (filter.search) {
      // Search in metrics or other fields if needed
      query.andWhere('run.id::text ILIKE :search', {
        search: `%${filter.search}%`,
      });
    }

    query.leftJoinAndSelect('run.job', 'job');
    query.orderBy('run.startedAt', 'DESC');

    const result = await this.syncRunRepository.paginate(
      query,
      filter,
      GetOneSyncRunResponseDto,
    );

    // Transform the result
    const transformedItems = result.items.map((item) => ({
      ...item,
      job: item.job
        ? {
            id: item.job.id,
            sourceId: item.job.sourceId,
            targetId: item.job.targetId,
            type: item.job.type,
          }
        : undefined,
    }));

    return plainToInstance(GetPaginatedSyncRunResponseDto, {
      ...result,
      items: transformedItems,
    });
  }

  async findSyncRunById(id: string): Promise<GetOneSyncRunResponseDto> {
    const syncRun = await this.syncRunRepo.findOne({
      where: { id },
      relations: ['job'],
    });

    if (!syncRun) {
      throw new CustomHttpException(ERROR_MESSAGES.SyncRunNotFound);
    }

    return plainToInstance(GetOneSyncRunResponseDto, {
      ...syncRun,
      job: syncRun.job
        ? {
            id: syncRun.job.id,
            sourceId: syncRun.job.sourceId,
            targetId: syncRun.job.targetId,
            type: syncRun.job.type,
          }
        : undefined,
    });
  }
}
