import {
  TBaseFilterRequestDto,
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import { ICreateSourceSettingRequestDto } from '@app/shared/dtos/source-setting/source-setting.dto';
import { TGetSourceSettingResponseDto } from '@app/shared/dtos/source-setting/source-setting.dto';
import {
  SOURCE_ENVIRONMENT,
  SOURCE_PROVIDER,
  SOURCE_STATUS,
  TSource,
} from '@app/shared/models/source.model';
import { TGetTargetResponseDto } from '../target/target.dto';

// Source DTOs
export type TFilterSourceRequestDto = TBaseFilterRequestDto & {
  projectId?: string;
  search?: string;
  provider?: SOURCE_PROVIDER;
  environment?: SOURCE_ENVIRONMENT;
  status?: SOURCE_STATUS;
};

export type TGetSourceResponseDto = TBaseModelResponseDto &
  Omit<
    TSource,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'deletedBy'
    | 'project'
    | 'sourceSetting'
    | 'target'
    | 'sfObjectsCatalog'
    | 'objectMappings'
    | 'syncJobs'
  > & {
    projectId: string;
    sourceSetting?: TGetSourceSettingResponseDto;
    target?: TGetTargetResponseDto;
  };

export type TGetPaginatedSourceResponseDto =
  TBaseResponsePaginationDto<TGetSourceResponseDto>;

export type ICreateSourceRequestDto = Pick<
  TSource,
  'projectId' | 'provider' | 'name'
> & {
  environment?: SOURCE_ENVIRONMENT;
  status?: SOURCE_STATUS;
  sourceSetting?: ICreateSourceSettingRequestDto;
};

export type IUpdateSourceRequestDto = Partial<
  Omit<ICreateSourceRequestDto, 'projectId'>
>;
