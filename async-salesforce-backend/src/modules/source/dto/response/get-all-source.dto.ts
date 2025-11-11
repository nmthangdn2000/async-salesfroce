import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneSourceResponseDto } from 'src/modules/source/dto/response/get-one-source.dto';

export class GetPaginatedSourceResponseDto extends BaseResponsePaginationDto<GetOneSourceResponseDto> {
  @ApiResponseProperty({
    type: [GetOneSourceResponseDto],
  })
  @Type(() => GetOneSourceResponseDto)
  @Expose()
  declare items: GetOneSourceResponseDto[];
}

