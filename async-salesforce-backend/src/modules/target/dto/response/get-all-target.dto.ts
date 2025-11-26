import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import { TGetPaginatedTargetResponseDto } from '@app/shared/dtos/target/target.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneTargetResponseDto } from 'src/modules/target/dto/response/get-one-target.dto';

export class GetPaginatedTargetResponseDto
  extends BaseResponsePaginationDto<GetOneTargetResponseDto>
  implements TGetPaginatedTargetResponseDto
{
  @ApiResponseProperty({
    type: [GetOneTargetResponseDto],
  })
  @Type(() => GetOneTargetResponseDto)
  @Expose()
  declare items: GetOneTargetResponseDto[];
}

