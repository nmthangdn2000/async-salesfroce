import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { TGetSfObjectsCatalogResponseDto } from '@app/shared/dtos/catalog/catalog.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneSfFieldsCatalogResponseDto } from './get-one-sf-fields-catalog.dto';

export class GetOneSfObjectsCatalogResponseDto
  extends BaseModelResponseDto
  implements TGetSfObjectsCatalogResponseDto
{
  @ApiResponseProperty({
    type: String,
  })
  @Expose()
  sourceId!: string;

  @ApiResponseProperty({
    type: String,
  })
  @Expose()
  apiName!: string;

  @ApiResponseProperty({
    type: String,
  })
  @Expose()
  label?: string;

  @ApiResponseProperty({
    type: Boolean,
  })
  @Expose()
  isSelected!: boolean;

  @ApiResponseProperty({
    type: String,
  })
  @Expose()
  selectedBy?: string;

  @ApiResponseProperty({
    type: Date,
  })
  @Expose()
  selectedAt?: Date;

  @ApiResponseProperty({
    type: [GetOneSfFieldsCatalogResponseDto],
  })
  @Expose()
  @Type(() => GetOneSfFieldsCatalogResponseDto)
  sfFieldsCatalog!: GetOneSfFieldsCatalogResponseDto[];
}

