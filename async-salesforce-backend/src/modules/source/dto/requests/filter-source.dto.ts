import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  SOURCE_ENVIRONMENT,
  SOURCE_PROVIDER,
  SOURCE_STATUS,
} from '@app/shared/models/source.model';

export class FilterSourceRequestDto extends BaseFilterRequestDto {
  @ApiProperty({
    description: 'Project ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiProperty({
    description: 'Search',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Source provider',
    enum: SOURCE_PROVIDER,
    required: false,
  })
  @IsOptional()
  @IsEnum(SOURCE_PROVIDER)
  provider?: SOURCE_PROVIDER;

  @ApiProperty({
    description: 'Source environment',
    enum: SOURCE_ENVIRONMENT,
    required: false,
  })
  @IsOptional()
  @IsEnum(SOURCE_ENVIRONMENT)
  environment?: SOURCE_ENVIRONMENT;

  @ApiProperty({
    description: 'Source status',
    enum: SOURCE_STATUS,
    required: false,
  })
  @IsOptional()
  @IsEnum(SOURCE_STATUS)
  status?: SOURCE_STATUS;
}

