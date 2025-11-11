import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { TFilterProjectRequestDto } from '@app/shared/dtos/project/project.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterProjectRequestDto
  extends BaseFilterRequestDto
  implements TFilterProjectRequestDto
{
  @ApiProperty({
    description: 'Search',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'User ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
