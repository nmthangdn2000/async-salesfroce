import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { TFilterFieldMappingRequestDto } from '@app/shared/dtos/mapping/mapping.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterFieldMappingRequestDto
  extends BaseFilterRequestDto
  implements TFilterFieldMappingRequestDto
{
  @ApiProperty({
    description: 'Filter by object mapping ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  objectMappingId?: string;

  @ApiProperty({
    description: 'Search by field API name or target column',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}

