import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { TFilterObjectMappingRequestDto } from '@app/shared/dtos/mapping/mapping.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterObjectMappingRequestDto
  extends BaseFilterRequestDto
  implements TFilterObjectMappingRequestDto
{
  @ApiProperty({
    description: 'Filter by source ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  sourceId?: string;

  @ApiProperty({
    description: 'Filter by target ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  targetId?: string;

  @ApiProperty({
    description: 'Search by object API name or target table',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}

