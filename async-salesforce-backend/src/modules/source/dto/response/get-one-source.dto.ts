import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { TGetSourceResponseDto } from '@app/shared/dtos';
import {
  SOURCE_ENVIRONMENT,
  SOURCE_PROVIDER,
  SOURCE_STATUS,
} from '@app/shared/models';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneSourceSettingResponseDto } from 'src/modules/source-setting/dto/response/get-one-source-setting.dto';
import { GetOneTargetResponseDto } from 'src/modules/target/dto/response/get-one-target.dto';

export class GetOneSourceResponseDto
  extends BaseModelResponseDto
  implements TGetSourceResponseDto
{
  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  projectId!: string;

  @ApiResponseProperty({
    type: String,
    enum: SOURCE_PROVIDER,
    example: SOURCE_PROVIDER.SALESFORCE,
  })
  @Expose()
  provider!: SOURCE_PROVIDER;

  @ApiResponseProperty({
    type: String,
    example: 'My Salesforce Source',
  })
  @Expose()
  name!: string;

  @ApiResponseProperty({
    type: String,
    enum: SOURCE_ENVIRONMENT,
    example: SOURCE_ENVIRONMENT.PROD,
  })
  @Expose()
  environment!: SOURCE_ENVIRONMENT;

  @ApiResponseProperty({
    type: String,
    enum: SOURCE_STATUS,
    example: SOURCE_STATUS.ACTIVE,
  })
  @Expose()
  status!: SOURCE_STATUS;

  @ApiResponseProperty({
    type: GetOneSourceSettingResponseDto,
  })
  @Type(() => GetOneSourceSettingResponseDto)
  @Expose()
  sourceSetting?: GetOneSourceSettingResponseDto;

  @ApiResponseProperty({
    type: () => GetOneTargetResponseDto,
  })
  @Type(() => GetOneTargetResponseDto)
  @Expose()
  target!: GetOneTargetResponseDto;
}
