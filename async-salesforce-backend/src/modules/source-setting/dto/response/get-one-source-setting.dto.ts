import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { TGetSourceSettingResponseDto } from '@app/shared/dtos/source-setting/source-setting.dto';
import { AUTH_TYPE } from '@app/shared/models/source.model';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class GetOneSourceSettingResponseDto
  extends BaseModelResponseDto
  implements TGetSourceSettingResponseDto
{
  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  sourceId!: string;

  @ApiResponseProperty({
    type: String,
    example: 'https://myinstance.salesforce.com',
  })
  @Expose()
  instanceUrl!: string;

  @ApiResponseProperty({
    type: String,
    enum: AUTH_TYPE,
    example: AUTH_TYPE.OAUTH2,
  })
  @Expose()
  authType!: AUTH_TYPE;

  @ApiResponseProperty({
    type: [String],
    example: ['api', 'refresh_token'],
  })
  @Expose()
  scopes?: string[];

  @ApiResponseProperty({
    type: String,
    example: '3MVG9...',
  })
  @Expose()
  clientId?: string;

  @ApiResponseProperty({
    type: String,
    example: 'ABC**',
  })
  @Expose()
  @Transform(({ value }) => {
    if (!value || typeof value !== 'string') {
      return value;
    }
    // Mask secret: show first 3 characters and replace rest with **
    if (value.length <= 3) {
      return '**';
    }
    return value.substring(0, 3) + '**';
  })
  clientSecret?: string;
}
