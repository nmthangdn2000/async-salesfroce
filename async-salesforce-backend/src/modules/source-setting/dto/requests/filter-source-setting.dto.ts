import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { AUTH_TYPE } from '@app/shared/models/source.model';

export class FilterSourceSettingRequestDto extends BaseFilterRequestDto {
  @ApiProperty({
    description: 'Source ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  sourceId?: string;

  @ApiProperty({
    description: 'Authentication type',
    enum: AUTH_TYPE,
    required: false,
  })
  @IsOptional()
  @IsEnum(AUTH_TYPE)
  authType?: AUTH_TYPE;
}

