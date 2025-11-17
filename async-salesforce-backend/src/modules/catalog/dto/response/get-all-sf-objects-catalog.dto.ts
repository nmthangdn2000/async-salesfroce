import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import { TGetPaginatedSfObjectsCatalogResponseDto } from '@app/shared/dtos/catalog/catalog.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneSfObjectsCatalogResponseDto } from './get-one-sf-objects-catalog.dto';

export class GetPaginatedSfObjectsCatalogResponseDto
  extends BaseResponsePaginationDto<GetOneSfObjectsCatalogResponseDto>
  implements TGetPaginatedSfObjectsCatalogResponseDto
{
  @ApiResponseProperty({
    type: [GetOneSfObjectsCatalogResponseDto],
  })
  @Type(() => GetOneSfObjectsCatalogResponseDto)
  @Expose()
  declare items: GetOneSfObjectsCatalogResponseDto[];
}

