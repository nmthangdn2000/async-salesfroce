import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { PROJECT_MEMBER_ROLE } from '@app/shared/models/project.model';

export class CreateProjectMemberRequestDto {
  @ApiProperty({
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({
    description: 'Member role',
    enum: PROJECT_MEMBER_ROLE,
    example: PROJECT_MEMBER_ROLE.VIEWER,
  })
  @IsEnum(PROJECT_MEMBER_ROLE)
  @IsNotEmpty()
  role!: PROJECT_MEMBER_ROLE;
}

