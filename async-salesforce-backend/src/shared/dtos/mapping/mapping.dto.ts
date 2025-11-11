import {
  TBaseFilterRequestDto,
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import {
  PK_STRATEGY,
  TFieldMapping,
  TObjectMapping,
} from '@app/shared/models/mapping.model';

// ObjectMapping DTOs
export type TFilterObjectMappingRequestDto = TBaseFilterRequestDto & {
  sourceId?: string;
  targetId?: string;
  search?: string;
  pkStrategy?: PK_STRATEGY;
};

export type TGetObjectMappingResponseDto = TBaseModelResponseDto &
  Omit<
    TObjectMapping,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'deletedBy'
    | 'source'
    | 'target'
    | 'fieldMappings'
  > & {
    sourceId: string;
    targetId: string;
    fieldMappings: TGetFieldMappingResponseDto[];
  };

export type TGetPaginatedObjectMappingResponseDto =
  TBaseResponsePaginationDto<TGetObjectMappingResponseDto>;

export type ICreateObjectMappingRequestDto = Pick<
  TObjectMapping,
  'sourceId' | 'objectApiName' | 'targetId' | 'targetTable' | 'pkStrategy'
>;

export type IUpdateObjectMappingRequestDto =
  Partial<ICreateObjectMappingRequestDto>;

// FieldMapping DTOs
export type TFilterFieldMappingRequestDto = TBaseFilterRequestDto & {
  objectMappingId?: string;
  search?: string;
  logicalType?: string;
};

export type TGetFieldMappingResponseDto = TBaseModelResponseDto &
  Omit<
    TFieldMapping,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'deletedBy'
    | 'objectMapping'
  > & {
    objectMappingId: string;
  };

export type TGetPaginatedFieldMappingResponseDto =
  TBaseResponsePaginationDto<TGetFieldMappingResponseDto>;

export type ICreateFieldMappingRequestDto = Pick<
  TFieldMapping,
  | 'objectMappingId'
  | 'sfFieldApiName'
  | 'targetColumn'
  | 'logicalType'
  | 'targetTypeOverride'
>;

export type IUpdateFieldMappingRequestDto =
  Partial<ICreateFieldMappingRequestDto>;

export type ICreateBulkFieldMappingRequestDto = {
  objectMappingId: string;
  fieldMappings: Omit<ICreateFieldMappingRequestDto, 'objectMappingId'>[];
};
