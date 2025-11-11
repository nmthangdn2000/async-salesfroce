import { BaseFilterRequestDto } from '@app/common/base/filter-request.dto.base';
import { TFilterProjectMemberRequestDto } from '@app/shared/dtos/project-member/project-member.dto';
import { PROJECT_MEMBER_ROLE } from '@app/shared/models/project.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class FilterProjectMemberRequestDto
  extends BaseFilterRequestDto
  implements TFilterProjectMemberRequestDto
{
  @ApiProperty({
    description: 'Project ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiProperty({
    description: 'User ID',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    description: 'Member role',
    enum: PROJECT_MEMBER_ROLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(PROJECT_MEMBER_ROLE)
  role?: PROJECT_MEMBER_ROLE;
}
