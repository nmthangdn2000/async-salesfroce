import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import { TGetPaginatedObjectMappingResponseDto } from '@app/shared/dtos/mapping/mapping.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneObjectMappingResponseDto } from './get-one-object-mapping.dto';

export class GetPaginatedObjectMappingResponseDto
  extends BaseResponsePaginationDto<GetOneObjectMappingResponseDto>
  implements TGetPaginatedObjectMappingResponseDto
{
  @ApiResponseProperty({
    type: [GetOneObjectMappingResponseDto],
  })
  @Type(() => GetOneObjectMappingResponseDto)
  @Expose()
  declare items: GetOneObjectMappingResponseDto[];
}

