import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { TGetSyncJobResponseDto } from '@app/shared/dtos/sync/sync.dto';
import { SYNC_JOB_STATUS } from '@app/shared/models/sync.model';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneSyncRunResponseDto } from './get-one-sync-run.dto';

export class GetOneSyncJobResponseDto
  extends BaseModelResponseDto
  implements TGetSyncJobResponseDto
{
  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  sourceId!: string;

  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  targetId!: string;

  @ApiResponseProperty({
    type: String,
    example: 'full',
  })
  @Expose()
  type!: string;

  @ApiResponseProperty({
    type: String,
    example: '0 0 * * *',
  })
  @Expose()
  scheduleCron?: string;

  @ApiResponseProperty({
    type: String,
    enum: SYNC_JOB_STATUS,
    example: SYNC_JOB_STATUS.IDLE,
  })
  @Expose()
  status!: SYNC_JOB_STATUS;

  @ApiResponseProperty({
    type: Date,
  })
  @Expose()
  lastRunAt?: Date;

  @ApiResponseProperty({
    type: Object,
  })
  @Expose()
  source?: {
    id: string;
    name: string;
    provider: string;
  };

  @ApiResponseProperty({
    type: Object,
  })
  @Expose()
  target?: {
    id: string;
    name: string;
    kind: string;
  };

  @ApiResponseProperty({
    type: [GetOneSyncRunResponseDto],
  })
  @Type(() => GetOneSyncRunResponseDto)
  @Expose()
  syncRuns?: GetOneSyncRunResponseDto[];
}

