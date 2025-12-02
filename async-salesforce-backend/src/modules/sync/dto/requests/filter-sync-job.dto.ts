import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { TFilterSyncJobRequestDto } from '@app/shared/dtos/sync/sync.dto';
import { SYNC_JOB_STATUS } from '@app/shared/models/sync.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterSyncJobRequestDto
  extends BaseFilterRequestDto
  implements TFilterSyncJobRequestDto
{
  @ApiProperty({
    description: 'Source ID filter',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  sourceId?: string;

  @ApiProperty({
    description: 'Target ID filter',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  targetId?: string;

  @ApiProperty({
    description: 'Status filter',
    enum: SYNC_JOB_STATUS,
    example: SYNC_JOB_STATUS.IDLE,
    required: false,
  })
  @IsEnum(SYNC_JOB_STATUS)
  @IsOptional()
  status?: SYNC_JOB_STATUS;

  @ApiProperty({
    description: 'Search term',
    example: 'account',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}

