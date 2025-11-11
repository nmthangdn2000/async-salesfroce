import { TGetProjectMemberResponseDto } from '@app/shared/dtos/project-member/project-member.dto';
import {
  TBaseFilterRequestDto,
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import { TProject } from '@app/shared/models/project.model';

// Project DTOs
export type TFilterProjectRequestDto = TBaseFilterRequestDto & {
  search?: string;
  userId?: string;
};

export type TGetProjectResponseDto = TBaseModelResponseDto &
  Omit<
    TProject,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'deletedBy'
    | 'projectMembers'
    | 'sources'
    | 'targets'
  > & {
    projectMembers: TGetProjectMemberResponseDto[];
    sourceCount?: number;
    targetCount?: number;
  };

export type TGetPaginatedProjectResponseDto =
  TBaseResponsePaginationDto<TGetProjectResponseDto>;

export type ICreateProjectRequestDto = Pick<TProject, 'name' | 'slug'>;

export type IUpdateProjectRequestDto = Partial<ICreateProjectRequestDto>;
