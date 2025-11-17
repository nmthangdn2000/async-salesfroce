import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import { TGetPaginatedSfFieldsCatalogResponseDto } from '@app/shared/dtos/catalog/catalog.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneSfFieldsCatalogResponseDto } from './get-one-sf-fields-catalog.dto';

export class GetPaginatedSfFieldsCatalogResponseDto
  extends BaseResponsePaginationDto<GetOneSfFieldsCatalogResponseDto>
  implements TGetPaginatedSfFieldsCatalogResponseDto
{
  @ApiResponseProperty({
    type: [GetOneSfFieldsCatalogResponseDto],
  })
  @Type(() => GetOneSfFieldsCatalogResponseDto)
  @Expose()
  declare items: GetOneSfFieldsCatalogResponseDto[];
}

