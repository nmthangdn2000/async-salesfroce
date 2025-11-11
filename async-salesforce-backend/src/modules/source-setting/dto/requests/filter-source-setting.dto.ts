import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { TFilterSourceSettingRequestDto } from '@app/shared/dtos/source-setting/source-setting.dto';
import { AUTH_TYPE } from '@app/shared/models/source.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class FilterSourceSettingRequestDto
  extends BaseFilterRequestDto
  implements TFilterSourceSettingRequestDto
{
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
