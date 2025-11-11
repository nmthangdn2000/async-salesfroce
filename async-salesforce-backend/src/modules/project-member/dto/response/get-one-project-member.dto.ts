import { BaseModelResponseDto } from '@app/common/base/model-response.dto.base';
import { TGetProjectMemberResponseDto } from '@app/shared/dtos/project-member/project-member.dto';
import { PROJECT_MEMBER_ROLE } from '@app/shared/models';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class GetOneProjectMemberResponseDto
  extends BaseModelResponseDto
  implements TGetProjectMemberResponseDto
{
  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  projectId!: string;

  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  userId!: string;

  @ApiResponseProperty({
    type: String,
    enum: PROJECT_MEMBER_ROLE,
    example: PROJECT_MEMBER_ROLE.VIEWER,
  })
  @Expose()
  role!: PROJECT_MEMBER_ROLE;

  @ApiResponseProperty({
    type: Object,
  })
  @Type(() => Object)
  @Expose()
  user?: {
    id: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
    };
  };
}
