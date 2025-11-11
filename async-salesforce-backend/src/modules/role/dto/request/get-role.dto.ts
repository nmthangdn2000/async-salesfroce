import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { TFilterRoleRequestDto } from '@app/shared/dtos/role/role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterRoleRequestDto
  extends BaseFilterRequestDto
  implements TFilterRoleRequestDto
{
  @ApiProperty({
    description: 'Search',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
