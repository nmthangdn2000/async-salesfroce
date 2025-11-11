import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { TGetProjectResponseDto } from '@app/shared/dtos/project/project.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetOneProjectMemberResponseDto } from 'src/modules/project-member/dto/response/get-one-project-member.dto';

export class GetOneProjectResponseDto
  extends BaseModelResponseDto
  implements TGetProjectResponseDto
{
  @ApiResponseProperty({
    type: String,
    example: 'My Project',
  })
  @Expose()
  name!: string;

  @ApiResponseProperty({
    type: String,
    example: 'my-project',
  })
  @Expose()
  slug!: string;

  @ApiResponseProperty({
    type: [GetOneProjectMemberResponseDto],
  })
  @Type(() => GetOneProjectMemberResponseDto)
  @Expose()
  projectMembers!: GetOneProjectMemberResponseDto[];

  @ApiResponseProperty({
    type: Number,
  })
  @Expose()
  sourceCount?: number;

  @ApiResponseProperty({
    type: Number,
  })
  @Expose()
  targetCount?: number;
}
