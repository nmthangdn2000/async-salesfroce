import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { TGetSyncRunResponseDto } from '@app/shared/dtos/sync/sync.dto';
import { SYNC_RUN_STATUS } from '@app/shared/models/sync.model';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetOneSyncRunResponseDto
  extends BaseModelResponseDto
  implements TGetSyncRunResponseDto
{
  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  jobId!: string;

  @ApiResponseProperty({
    type: Date,
  })
  @Expose()
  startedAt!: Date;

  @ApiResponseProperty({
    type: Date,
  })
  @Expose()
  finishedAt?: Date;

  @ApiResponseProperty({
    type: String,
    enum: SYNC_RUN_STATUS,
    example: SYNC_RUN_STATUS.SUCCESS,
  })
  @Expose()
  status?: SYNC_RUN_STATUS;

  @ApiResponseProperty({
    type: Object,
  })
  @Expose()
  metrics?: Record<string, any>;

  @ApiResponseProperty({
    type: Object,
  })
  @Expose()
  job?: {
    id: string;
    sourceId: string;
    targetId: string;
    type: string;
  };
}

