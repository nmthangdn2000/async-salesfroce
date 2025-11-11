import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import { TGetPaginatedProjectMemberResponseDto } from '@app/shared/dtos/project-member/project-member.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneProjectMemberResponseDto } from 'src/modules/project-member/dto/response/get-one-project-member.dto';

export class GetPaginatedProjectMemberResponseDto
  extends BaseResponsePaginationDto<GetOneProjectMemberResponseDto>
  implements TGetPaginatedProjectMemberResponseDto
{
  @ApiResponseProperty({
    type: [GetOneProjectMemberResponseDto],
  })
  @Type(() => GetOneProjectMemberResponseDto)
  @Expose()
  declare items: GetOneProjectMemberResponseDto[];
}
