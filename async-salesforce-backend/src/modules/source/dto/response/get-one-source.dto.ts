import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  SOURCE_ENVIRONMENT,
  SOURCE_PROVIDER,
  SOURCE_STATUS,
} from '@app/shared/models/source.model';

export class GetOneSourceResponseDto {
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

