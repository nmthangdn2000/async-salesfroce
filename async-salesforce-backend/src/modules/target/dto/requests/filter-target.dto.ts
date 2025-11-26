import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { TFilterTargetRequestDto } from '@app/shared/dtos/target/target.dto';
import { TARGET_KIND } from '@app/shared/models/target.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterTargetRequestDto
  extends BaseFilterRequestDto
  implements TFilterTargetRequestDto
{
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
    description: 'Target kind',
    enum: TARGET_KIND,
    required: false,
  })
  @IsOptional()
  @IsEnum(TARGET_KIND)
  kind?: TARGET_KIND;
}

