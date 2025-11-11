import { BaseResponsePaginationDto } from '@app/common/base/response.dto.base';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneProjectMemberResponseDto } from 'src/modules/project-member/dto/response/get-one-project-member.dto';

export class GetPaginatedProjectMemberResponseDto extends BaseResponsePaginationDto<GetOneProjectMemberResponseDto> {
  @ApiResponseProperty({
    type: [GetOneProjectMemberResponseDto],
  })
  @Type(() => GetOneProjectMemberResponseDto)
  @Expose()
  declare items: GetOneProjectMemberResponseDto[];
}

