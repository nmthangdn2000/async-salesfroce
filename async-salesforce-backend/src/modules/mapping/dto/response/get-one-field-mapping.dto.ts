import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { TGetFieldMappingResponseDto } from '@app/shared/dtos/mapping/mapping.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetOneFieldMappingResponseDto
  extends BaseModelResponseDto
  implements TGetFieldMappingResponseDto
{
  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  objectMappingId!: string;

  @ApiResponseProperty({
    type: String,
    example: 'Name',
  })
  @Expose()
  sfFieldApiName!: string;

  @ApiResponseProperty({
    type: String,
    example: 'name',
  })
  @Expose()
  targetColumn!: string;

  @ApiResponseProperty({
    type: String,
    example: 'string',
  })
  @Expose()
  logicalType!: string;

  @ApiResponseProperty({
    type: String,
  })
  @Expose()
  targetTypeOverride?: string;
}

