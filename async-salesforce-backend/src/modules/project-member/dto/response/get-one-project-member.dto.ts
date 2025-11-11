import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PROJECT_MEMBER_ROLE } from '@app/shared/models/project.model';

export class GetOneProjectMemberResponseDto {
  @ApiResponseProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id!: string;

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
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt!: Date;

  @ApiResponseProperty({
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt!: Date;
}

