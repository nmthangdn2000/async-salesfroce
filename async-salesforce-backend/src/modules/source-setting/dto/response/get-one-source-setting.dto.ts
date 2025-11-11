import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AUTH_TYPE } from '@app/shared/models/source.model';

export class GetOneSourceSettingResponseDto {
  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id!: string;

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
    required: false,
  })
  @Expose()
  scopes?: string[];

  @ApiResponseProperty({
    type: String,
    example: 'secret-key-ref',
  })
  @Expose()
  secretsRef!: string;

  @ApiResponseProperty({
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt!: Date;

  @ApiResponseProperty({
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt!: Date;
}

