import { IUpdateSyncJobRequestDto } from '@app/shared/dtos/sync/sync.dto';
import { SYNC_JOB_STATUS } from '@app/shared/models/sync.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateSyncJobRequestDto implements IUpdateSyncJobRequestDto {
  @ApiProperty({
    description: 'Sync type (e.g., "full", "incremental")',
    example: 'full',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'Cron schedule expression',
    example: '0 0 * * *',
    required: false,
  })
  @IsString()
  @IsOptional()
  scheduleCron?: string;

  @ApiProperty({
    description: 'Sync job status',
    enum: SYNC_JOB_STATUS,
    example: SYNC_JOB_STATUS.IDLE,
    required: false,
  })
  @IsEnum(SYNC_JOB_STATUS)
  @IsOptional()
  status?: SYNC_JOB_STATUS;
}

