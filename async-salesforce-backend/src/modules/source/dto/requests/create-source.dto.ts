import { ICreateSourceRequestDto } from '@app/shared/dtos/source/source.dto';
import {
  SOURCE_ENVIRONMENT,
  SOURCE_PROVIDER,
  SOURCE_STATUS,
} from '@app/shared/models/source.model';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSourceRequestDto implements ICreateSourceRequestDto {
  @ApiProperty({
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;

  @ApiProperty({
    description: 'Source provider',
    enum: SOURCE_PROVIDER,
    example: SOURCE_PROVIDER.SALESFORCE,
  })
  @IsEnum(SOURCE_PROVIDER)
  @IsNotEmpty()
  provider!: SOURCE_PROVIDER;

  @ApiProperty({
    description: 'Source name',
    example: 'My Salesforce Source',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Source environment',
    enum: SOURCE_ENVIRONMENT,
    example: SOURCE_ENVIRONMENT.PROD,
    required: false,
    default: SOURCE_ENVIRONMENT.PROD,
  })
  @IsEnum(SOURCE_ENVIRONMENT)
  @IsOptional()
  environment?: SOURCE_ENVIRONMENT;

  @ApiProperty({
    description: 'Source status',
    enum: SOURCE_STATUS,
    example: SOURCE_STATUS.ACTIVE,
    required: false,
    default: SOURCE_STATUS.ACTIVE,
  })
  @IsEnum(SOURCE_STATUS)
  @IsOptional()
  status?: SOURCE_STATUS;
}
