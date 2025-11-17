import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { TGetSfFieldsCatalogResponseDto } from '@app/shared/dtos/catalog/catalog.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetOneSfFieldsCatalogResponseDto
  extends BaseModelResponseDto
  implements TGetSfFieldsCatalogResponseDto
{
  @ApiResponseProperty({
    type: String,
  })
  @Expose()
  objectId!: string;

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
    type: String,
  })
  @Expose()
  sfType!: string;

  @ApiResponseProperty({
    type: Boolean,
  })
  @Expose()
  isRequired?: boolean;

  @ApiResponseProperty({
    type: Number,
  })
  @Expose()
  length?: number;

  @ApiResponseProperty({
    type: Number,
  })
  @Expose()
  precision?: number;

  @ApiResponseProperty({
    type: Number,
  })
  @Expose()
  scale?: number;

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
}

