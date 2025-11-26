import {
  TBaseFilterRequestDto,
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import { TARGET_KIND, TTarget } from '@app/shared/models/target.model';

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
    | 'objectMappings'
    | 'syncJobs'
  > & {
    projectId: string;
  };

export type TGetPaginatedTargetResponseDto =
  TBaseResponsePaginationDto<TGetTargetResponseDto>;

export type ICreateTargetRequestDto = Pick<
  TTarget,
  'projectId' | 'kind' | 'name'
> & {
  connectInfo?: Record<string, any>;
  secretsRef?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  schema?: string;
  ssl?: boolean;
  sslMode?: string;
  connectionString?: string;
};

export type IUpdateTargetRequestDto = Partial<
  Omit<ICreateTargetRequestDto, 'projectId'>
>;
