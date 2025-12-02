import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import { TGetPaginatedFieldMappingResponseDto } from '@app/shared/dtos/mapping/mapping.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneFieldMappingResponseDto } from './get-one-field-mapping.dto';

export class GetPaginatedFieldMappingResponseDto
  extends BaseResponsePaginationDto<GetOneFieldMappingResponseDto>
  implements TGetPaginatedFieldMappingResponseDto
{
  @ApiResponseProperty({
    type: [GetOneFieldMappingResponseDto],
  })
  @Type(() => GetOneFieldMappingResponseDto)
  @Expose()
  declare items: GetOneFieldMappingResponseDto[];
}

