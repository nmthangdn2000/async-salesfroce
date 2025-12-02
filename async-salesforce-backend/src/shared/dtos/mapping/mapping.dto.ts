import {
  TBaseFilterRequestDto,
  TBaseModelResponseDto,
  TBaseResponsePaginationDto,
} from '@app/shared/dtos/response.dto';
import { PK_STRATEGY } from '@app/shared/models/mapping.model';

// Object Mapping DTOs
export type TFilterObjectMappingRequestDto = TBaseFilterRequestDto & {
  sourceId?: string;
  targetId?: string;
  search?: string;
};

export type TGetObjectMappingResponseDto = TBaseModelResponseDto & {
  sourceId: string;
  objectApiName: string;
  targetId: string;
  targetTable: string;
  pkStrategy: PK_STRATEGY;
  fieldMappings?: TGetFieldMappingResponseDto[];
};

export type TGetPaginatedObjectMappingResponseDto =
  TBaseResponsePaginationDto<TGetObjectMappingResponseDto>;

export type ICreateObjectMappingRequestDto = {
  sourceId: string;
  objectApiName: string;
  targetId: string;
  targetTable: string;
  pkStrategy?: PK_STRATEGY;
};

export type IUpdateObjectMappingRequestDto = Partial<
  Omit<ICreateObjectMappingRequestDto, 'sourceId' | 'targetId'>
>;

// Field Mapping DTOs
export type TFilterFieldMappingRequestDto = TBaseFilterRequestDto & {
  objectMappingId?: string;
  search?: string;
};

export type TGetFieldMappingResponseDto = TBaseModelResponseDto & {
  objectMappingId: string;
  sfFieldApiName: string;
  targetColumn: string;
  logicalType: string;
  targetTypeOverride?: string;
};

export type TGetPaginatedFieldMappingResponseDto =
  TBaseResponsePaginationDto<TGetFieldMappingResponseDto>;

export type ICreateFieldMappingRequestDto = {
  objectMappingId: string;
  sfFieldApiName: string;
  targetColumn: string;
  logicalType: string;
  targetTypeOverride?: string;
};

export type IUpdateFieldMappingRequestDto = Partial<
  Omit<ICreateFieldMappingRequestDto, 'objectMappingId'>
>;

export type IBulkCreateFieldMappingRequestDto = {
  objectMappingId: string;
  fieldMappings: Omit<ICreateFieldMappingRequestDto, 'objectMappingId'>[];
};
