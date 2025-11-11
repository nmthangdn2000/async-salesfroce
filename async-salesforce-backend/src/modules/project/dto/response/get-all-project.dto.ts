import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneProjectResponseDto } from 'src/modules/project/dto/response/get-one-project.dto';

export class GetPaginatedProjectResponseDto extends BaseResponsePaginationDto<GetOneProjectResponseDto> {
  @ApiResponseProperty({
    type: [GetOneProjectResponseDto],
  })
  @Type(() => GetOneProjectResponseDto)
  @Expose()
  declare items: GetOneProjectResponseDto[];
}
