import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { TFilterSyncRunRequestDto } from '@app/shared/dtos/sync/sync.dto';
import { SYNC_RUN_STATUS } from '@app/shared/models/sync.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterSyncRunRequestDto
  extends BaseFilterRequestDto
  implements TFilterSyncRunRequestDto
{
  @ApiProperty({
    description: 'Sync Job ID filter',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  jobId?: string;

  @ApiProperty({
    description: 'Status filter',
    enum: SYNC_RUN_STATUS,
    example: SYNC_RUN_STATUS.SUCCESS,
    required: false,
  })
  @IsEnum(SYNC_RUN_STATUS)
  @IsOptional()
  status?: SYNC_RUN_STATUS;

  @ApiProperty({
    description: 'Search term',
    example: 'account',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}

