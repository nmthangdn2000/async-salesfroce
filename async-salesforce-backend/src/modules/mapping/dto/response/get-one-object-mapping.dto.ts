import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { TGetObjectMappingResponseDto } from '@app/shared/dtos/mapping/mapping.dto';
import { PK_STRATEGY } from '@app/shared/models/mapping.model';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneFieldMappingResponseDto } from './get-one-field-mapping.dto';

export class GetOneObjectMappingResponseDto
  extends BaseModelResponseDto
  implements TGetObjectMappingResponseDto
{
  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  sourceId!: string;

  @ApiResponseProperty({
    type: String,
    example: 'Account',
  })
  @Expose()
  objectApiName!: string;

  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  targetId!: string;

  @ApiResponseProperty({
    type: String,
    example: 'accounts',
  })
  @Expose()
  targetTable!: string;

  @ApiResponseProperty({
    type: String,
    enum: PK_STRATEGY,
    example: PK_STRATEGY.SF_ID,
  })
  @Expose()
  pkStrategy!: PK_STRATEGY;

  @ApiResponseProperty({
    type: [GetOneFieldMappingResponseDto],
  })
  @Type(() => GetOneFieldMappingResponseDto)
  @Expose()
  fieldMappings?: GetOneFieldMappingResponseDto[];
}

