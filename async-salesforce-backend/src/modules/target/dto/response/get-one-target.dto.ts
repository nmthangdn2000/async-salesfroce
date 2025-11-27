import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { TGetTargetResponseDto, CONNECTION_TYPE } from '@app/shared/dtos/target/target.dto';
import { TARGET_KIND } from '@app/shared/models/target.model';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneSourceResponseDto } from 'src/modules/source/dto/response/get-one-source.dto';

export class GetOneTargetResponseDto
  extends BaseModelResponseDto
  implements TGetTargetResponseDto
{
  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  projectId!: string;

  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  sourceId!: string;

  @ApiResponseProperty({
    type: String,
    enum: TARGET_KIND,
    example: TARGET_KIND.POSTGRES,
  })
  @Expose()
  kind!: TARGET_KIND;

  @ApiResponseProperty({
    type: String,
    example: 'PostgreSQL Warehouse',
  })
  @Expose()
  name!: string;

  @ApiResponseProperty({
    type: String,
    enum: ['host', 'url'],
  })
  @Expose()
  connectionType!: CONNECTION_TYPE;

  @ApiResponseProperty({
    type: String,
  })
  @Expose()
  host?: string;

  @ApiResponseProperty({
    type: Number,
  })
  @Expose()
  port?: number;

  @ApiResponseProperty({
    type: String,
  })
  @Expose()
  database?: string;

  @ApiResponseProperty({
    type: String,
  })
  @Expose()
  username?: string;

  @ApiResponseProperty({
    type: String,
  })
  @Expose()
  schema?: string;

  @ApiResponseProperty({
    type: Boolean,
  })
  @Expose()
  ssl!: boolean;

  @ApiResponseProperty({
    type: String,
  })
  @Expose()
  sslMode?: string;

  @ApiResponseProperty({
    type: String,
  })
  @Expose()
  connectionString?: string;

  @ApiResponseProperty({
    type: () => GetOneSourceResponseDto,
  })
  @Type(() => GetOneSourceResponseDto)
  @Expose()
  source!: GetOneSourceResponseDto;
}
