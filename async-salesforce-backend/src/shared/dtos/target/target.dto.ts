import {
  TBaseFilterRequestDto,
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import {
  TARGET_KIND,
  TTarget,
  TTargetConnection,
} from '@app/shared/models/target.model';

// Target DTOs
export type TFilterTargetRequestDto = TBaseFilterRequestDto & {
  projectId?: string;
  search?: string;
  kind?: TARGET_KIND;
};

export type TGetTargetResponseDto = TBaseModelResponseDto &
  Omit<
    TTarget,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'deletedBy'
    | 'project'
    | 'targetConnections'
    | 'objectMappings'
    | 'syncJobs'
  > & {
    projectId: string;
    targetConnections?: TGetTargetConnectionResponseDto[];
  };

export type TGetPaginatedTargetResponseDto =
  TBaseResponsePaginationDto<TGetTargetResponseDto>;

export type ICreateTargetRequestDto = Pick<
  TTarget,
  'projectId' | 'kind' | 'name'
> & {
  targetConnection?: ICreateTargetConnectionRequestDto;
};

export type IUpdateTargetRequestDto = Partial<
  Omit<ICreateTargetRequestDto, 'projectId'>
>;

// TargetConnection DTOs
export type TGetTargetConnectionResponseDto = TBaseModelResponseDto &
  Omit<
    TTargetConnection,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'deletedBy'
    | 'target'
    | 'secretsRef'
  > & {
    targetId: string;
    connectInfo: Record<string, any>;
  };

export type ICreateTargetConnectionRequestDto = Pick<
  TTargetConnection,
  'connectInfo'
> & {
  secretsRef: string;
};

export type IUpdateTargetConnectionRequestDto =
  Partial<ICreateTargetConnectionRequestDto>;
