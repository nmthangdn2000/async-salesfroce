import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { TFilterSfFieldsCatalogRequestDto } from '@app/shared/dtos/catalog/catalog.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterSfFieldsCatalogRequestDto
  extends BaseFilterRequestDto
  implements TFilterSfFieldsCatalogRequestDto
{
  @ApiProperty({
    description: 'Object ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  objectId?: string;

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

  @ApiProperty({
    description: 'Filter by Salesforce field type',
    required: false,
  })
  @IsOptional()
  @IsString()
  sfType?: string;
}
