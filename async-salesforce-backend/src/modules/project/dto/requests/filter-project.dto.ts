import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterProjectRequestDto extends BaseFilterRequestDto {
  @ApiProperty({
    description: 'Search',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
