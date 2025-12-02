import { UUIDParam } from '@app/common/decorators/uuid-param.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSyncJobRequestDto } from './dto/requests/create-sync-job.dto';
import { FilterSyncJobRequestDto } from './dto/requests/filter-sync-job.dto';
import { FilterSyncRunRequestDto } from './dto/requests/filter-sync-run.dto';
import { TriggerSyncRequestDto } from './dto/requests/trigger-sync.dto';
import { UpdateSyncJobRequestDto } from './dto/requests/update-sync-job.dto';
import { GetPaginatedSyncJobResponseDto } from './dto/response/get-all-sync-job.dto';
import { GetPaginatedSyncRunResponseDto } from './dto/response/get-all-sync-run.dto';
import { GetOneSyncJobResponseDto } from './dto/response/get-one-sync-job.dto';
import { GetOneSyncRunResponseDto } from './dto/response/get-one-sync-run.dto';
import { SyncJobEntity } from './entities/sync-job.entity';
import { SyncRunEntity } from './entities/sync-run.entity';
import { SyncService } from './sync.service';

@ApiTags('Sync')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  // Sync Job endpoints
  @Post('jobs')
  @ApiOperation({ summary: 'Create a new sync job' })
  @ApiResponse({
    status: 201,
    description: 'The sync job has been successfully created.',
    type: SyncJobEntity,
  })
  @ApiBody({ type: CreateSyncJobRequestDto })
  async createSyncJob(
    @Body() createDto: CreateSyncJobRequestDto,
  ): Promise<SyncJobEntity> {
    return this.syncService.createSyncJob(createDto);
  }

  @Get('jobs')
  @ApiOperation({ summary: 'Get all sync jobs' })
  @ApiResponse({
    status: 200,
    description: 'The sync jobs have been successfully retrieved.',
    type: GetPaginatedSyncJobResponseDto,
  })
  async findAllSyncJobs(
    @Query() filter: FilterSyncJobRequestDto,
  ): Promise<GetPaginatedSyncJobResponseDto> {
    return this.syncService.findAllSyncJobs(filter);
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get a sync job by id' })
  @ApiParam({ name: 'id', description: 'Sync job ID' })
  @ApiResponse({
    status: 200,
    description: 'The sync job has been successfully retrieved.',
    type: GetOneSyncJobResponseDto,
  })
  async findSyncJobById(
    @UUIDParam('id') id: string,
  ): Promise<GetOneSyncJobResponseDto> {
    return this.syncService.findSyncJobById(id);
  }

  @Patch('jobs/:id')
  @ApiOperation({ summary: 'Update a sync job' })
  @ApiParam({ name: 'id', description: 'Sync job ID' })
  @ApiResponse({
    status: 200,
    description: 'The sync job has been successfully updated.',
    type: SyncJobEntity,
  })
  @ApiBody({ type: UpdateSyncJobRequestDto })
  async updateSyncJob(
    @UUIDParam('id') id: string,
    @Body() updateDto: UpdateSyncJobRequestDto,
  ): Promise<SyncJobEntity> {
    return this.syncService.updateSyncJob(id, updateDto);
  }

  @Delete('jobs/:id')
  @ApiOperation({ summary: 'Delete a sync job' })
  @ApiParam({ name: 'id', description: 'Sync job ID' })
  @ApiResponse({
    status: 200,
    description: 'The sync job has been successfully deleted.',
  })
  async deleteSyncJob(@UUIDParam('id') id: string): Promise<void> {
    return this.syncService.deleteSyncJob(id);
  }

  // Trigger Sync endpoint
  @Post('trigger')
  @ApiOperation({ summary: 'Trigger a sync job manually' })
  @ApiResponse({
    status: 201,
    description: 'The sync has been successfully triggered.',
    type: SyncRunEntity,
  })
  @ApiBody({ type: TriggerSyncRequestDto })
  async triggerSync(
    @Body() triggerDto: TriggerSyncRequestDto,
  ): Promise<SyncRunEntity> {
    return this.syncService.triggerSync(triggerDto.jobId);
  }

  // Sync Run endpoints
  @Get('runs')
  @ApiOperation({ summary: 'Get all sync runs' })
  @ApiResponse({
    status: 200,
    description: 'The sync runs have been successfully retrieved.',
    type: GetPaginatedSyncRunResponseDto,
  })
  async findAllSyncRuns(
    @Query() filter: FilterSyncRunRequestDto,
  ): Promise<GetPaginatedSyncRunResponseDto> {
    return this.syncService.findAllSyncRuns(filter);
  }

  @Get('runs/:id')
  @ApiOperation({ summary: 'Get a sync run by id' })
  @ApiParam({ name: 'id', description: 'Sync run ID' })
  @ApiResponse({
    status: 200,
    description: 'The sync run has been successfully retrieved.',
    type: GetOneSyncRunResponseDto,
  })
  async findSyncRunById(
    @UUIDParam('id') id: string,
  ): Promise<GetOneSyncRunResponseDto> {
    return this.syncService.findSyncRunById(id);
  }
}
