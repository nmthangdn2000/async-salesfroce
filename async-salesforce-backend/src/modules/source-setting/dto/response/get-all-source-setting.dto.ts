import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import { TGetPaginatedSourceSettingResponseDto } from '@app/shared/dtos/source-setting/source-setting.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneSourceSettingResponseDto } from 'src/modules/source-setting/dto/response/get-one-source-setting.dto';

export class GetPaginatedSourceSettingResponseDto
  extends BaseResponsePaginationDto<GetOneSourceSettingResponseDto>
  implements TGetPaginatedSourceSettingResponseDto
{
  @ApiResponseProperty({
    type: [GetOneSourceSettingResponseDto],
  })
  @Type(() => GetOneSourceSettingResponseDto)
  @Expose()
  declare items: GetOneSourceSettingResponseDto[];
}
