import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import { TGetPaginatedSyncRunResponseDto } from '@app/shared/dtos/sync/sync.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneSyncRunResponseDto } from './get-one-sync-run.dto';

export class GetPaginatedSyncRunResponseDto
  extends BaseResponsePaginationDto<GetOneSyncRunResponseDto>
  implements TGetPaginatedSyncRunResponseDto
{
  @ApiResponseProperty({
    type: [GetOneSyncRunResponseDto],
  })
  @Type(() => GetOneSyncRunResponseDto)
  @Expose()
  declare items: GetOneSyncRunResponseDto[];
}

