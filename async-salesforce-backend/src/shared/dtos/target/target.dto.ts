import {
  TBaseFilterRequestDto,
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import { TARGET_KIND, TTarget, CONNECTION_TYPE } from '@app/shared/models/target.model';

export { CONNECTION_TYPE };

// Target DTOs
export type TFilterTargetRequestDto = TBaseFilterRequestDto & {
  projectId?: string;
  sourceId?: string;
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
    | 'source'
    | 'objectMappings'
    | 'syncJobs'
  > & {
    projectId: string;
    sourceId: string;
  };

export type TGetPaginatedTargetResponseDto =
  TBaseResponsePaginationDto<TGetTargetResponseDto>;

export type ICreateTargetRequestDto = Pick<
  TTarget,
  'projectId' | 'sourceId' | 'kind' | 'name'
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
