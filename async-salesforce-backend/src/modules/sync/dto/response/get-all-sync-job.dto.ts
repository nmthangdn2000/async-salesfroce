import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import { TGetPaginatedSyncJobResponseDto } from '@app/shared/dtos/sync/sync.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneSyncJobResponseDto } from './get-one-sync-job.dto';

export class GetPaginatedSyncJobResponseDto
  extends BaseResponsePaginationDto<GetOneSyncJobResponseDto>
  implements TGetPaginatedSyncJobResponseDto
{
  @ApiResponseProperty({
    type: [GetOneSyncJobResponseDto],
  })
  @Type(() => GetOneSyncJobResponseDto)
  @Expose()
  declare items: GetOneSyncJobResponseDto[];
}

