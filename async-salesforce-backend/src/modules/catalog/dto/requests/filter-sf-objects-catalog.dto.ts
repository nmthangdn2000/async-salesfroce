import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { TFilterSfObjectsCatalogRequestDto } from '@app/shared/dtos/catalog/catalog.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterSfObjectsCatalogRequestDto
  extends BaseFilterRequestDto
  implements TFilterSfObjectsCatalogRequestDto
{
  @ApiProperty({
    description: 'Source ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  sourceId?: string;

  @ApiProperty({
    description: 'Search by API name or label',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by selected status',
    required: false,
  })
  @IsOptional()
  @IsBooleanString()
  isSelected?: boolean;
}
