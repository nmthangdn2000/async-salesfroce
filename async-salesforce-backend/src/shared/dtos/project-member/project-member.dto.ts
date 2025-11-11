import {
  TBaseFilterRequestDto,
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import {
  PROJECT_MEMBER_ROLE,
  TProjectMember,
} from '@app/shared/models/project.model';

export type TFilterProjectMemberRequestDto = TBaseFilterRequestDto & {
  projectId?: string;
  userId?: string;
  role?: PROJECT_MEMBER_ROLE;
};

export type TGetProjectMemberResponseDto = TBaseModelResponseDto &
  Omit<
    TProjectMember,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'deletedBy'
    | 'project'
    | 'user'
  > & {
    projectId: string;
    userId: string;
    user?: {
      id: string;
      email: string;
      profile?: {
        firstName?: string;
        lastName?: string;
      };
    };
  };

export type TGetPaginatedProjectMemberResponseDto =
  TBaseResponsePaginationDto<TGetProjectMemberResponseDto>;

export type ICreateProjectMemberRequestDto = Pick<
  TProjectMember,
  'projectId' | 'userId' | 'role'
>;

export type IUpdateProjectMemberRequestDto =
  Partial<ICreateProjectMemberRequestDto>;
